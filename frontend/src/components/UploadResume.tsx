


import React, { useState } from "react";
import axios from "axios";

// This component uses a simple, self-contained approach without external libraries
// to ensure it runs correctly in any environment.
const UploadResume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a resume file to upload.");
      return;
    }

    setIsProcessing(true);
    setMessage("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      // Step 1: Upload the file and get the extracted JSON from the server
      const extractionResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/resumes/extract`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedData = extractionResponse.data.extracted;
      console.log("Extracted data from server:", extractedData);

      if (extractedData.error) {
        setMessage("Server failed to parse the resume. Please try again.");
        return;
      }

      // Step 2: Use the extracted data to generate the PDF on the server
      const pdfResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/resumes/resume-template`,
        extractedData, // Send the entire extracted data object
        {
          responseType: "blob", // Important: tells axios to expect a file
        }
      );

      // Step 3: Trigger the file download
      const fileURL = window.URL.createObjectURL(new Blob([pdfResponse.data]));
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "company_resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setMessage("Resume successfully generated and downloaded.");

    } catch (error) {
      console.error("Failed to generate resume:", error);
      setMessage("Failed to process resume. Please check the server and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center">Resume to Company Format Converter</h2>
        <p className="text-center text-gray-500 mt-2">
          Upload your resume and get a company-formatted PDF instantly.
        </p>
        <div className="flex flex-col items-center space-y-4">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileChange} 
            className="w-full p-2 border rounded-md"
          />
          <button 
            onClick={handleUpload} 
            disabled={isProcessing || !file} 
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isProcessing ? "Processing..." : "Upload & Generate PDF"}
          </button>
        </div>
        {isProcessing && (
          <p className="mt-2 text-center text-gray-600">
            Please wait, your resume is being processed. This may take a moment.
          </p>
        )}
        {message && (
          <div className="mt-4 text-center p-3 rounded-md bg-gray-200">
            <p className="text-gray-800">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;
