import { useEffect, useRef, useState } from "react";

const CameraCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [label, setLabel] = useState(""); // Store the label input value

  useEffect(() => {
    startCamera();
  }, []);

  // Handle label input change
  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!label.trim()) {
      alert("Please enter a label!");
      return;
    }

    if (!capturedImage) {
      alert("Please upload an image!");
      return;
    }

    // Prepare the form data for the API request
    const formData = new FormData();
    formData.append("label", label);
    formData.append("image", capturedImage);

    try {
      // Send the image and label to the Spring Boot API (example URL)
      const response = await fetch("http://your-api-url.com/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Image uploaded successfully!");
        alert("Image uploaded successfully!");
      } else {
        console.error("Upload failed");
        alert("Upload failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading image!");
    }
  };

  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log("Available devices:", devices);

      const cameras = devices.filter((device) => device.kind === "videoinput");

      if (cameras.length === 0) {
        alert("No cameras found!");
        setCameraError(true);
        return;
      }

      // Prefer back camera if available
      const backCamera = cameras.find((camera) =>
        camera.label.toLowerCase().includes("back")
      );
      const selectedCamera = backCamera || cameras[0];

      console.log("Using camera:", selectedCamera.label);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedCamera.deviceId || undefined,
          facingMode: "environment",
        },
      });

      console.log("Camera stream received:", stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, playing...");
          videoRef.current
            .play()
            .catch((err) => console.error("Error playing video:", err));
        };
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setCameraError(true);
      alert("Camera access is required. Please check permissions.");
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/png")); // Convert canvas to image
    }
  };

  return (
    <div className="flex flex-col min-h-screen min-w-screen justify-center items-center bg-sky-200">
      {/* Video feed */}
      {!cameraError ? (
        <div className="relative h-96 w-full">
          {/* Overlay with cutout */}
          <div
            className="absolute inset-0 bg-black/50"
            style={{
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 25%, 10% 25%, 10% 75%, 90% 75%, 90% 25%, 0% 25%)",
            }}
          />
          {/* Define explicit size for parent */}
          {/* Camera feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="text-white text-center">
          <p className="text-lg">Camera access denied.</p>
          <button
            onClick={startCamera}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg font-bold w-2xl "
          >
            Retry Camera Access
          </button>
        </div>
      )}

      {/* Capture Button */}
      {!cameraError && (
        <button
          onClick={captureImage}
          className="bottom-10 w-36 bg-white text-black m-4 px-6 py-2 rounded-full font-bold shadow-md"
        >
          Capture
        </button>
      )}

      {/* Hidden canvas for capturing image */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Display Captured Image */}
      {capturedImage && (
        <div className="absolute top-5 left-5 bg-white p-2 rounded-lg shadow-lg">
          <div className="flex justify-center">
            <img
              src={capturedImage}
              alt="Captured"
              className="w-32 h-32 object-cover rounded-md border-2 border-b-black"
            />
            <div className="flex flex-col justify-between items-center">
              <div className="flex flex-col">
                <p className="ml-2">Label</p>
                <input
                  type="number"
                  inputMode="numeric"
                  className="border-2 p-2 rounded m-2"
                  placeholder="Total sum"
                  onChange={handleLabelChange}
                />
              </div>
              <div>
                <button
                  onClick={() => setCapturedImage(null)}
                  className="m-2 bg-red-500 text-white px-4 py-1 rounded w-24"
                >
                  Retake
                </button>
                <button
                  onClick={handleSubmit}
                  className="m-2 bg-blue-500 text-white px-4 py-1 rounded w-24"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
