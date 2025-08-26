// import React, { useState } from "react";
// import axios from "axios";

// const UploadResume: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert("Please upload a resume file");
//       return;
//     }

//     setIsProcessing(true);

//     const formData = new FormData();
//     formData.append("resume", file);

//     try {
//       // Step 1: Upload the file and get the extracted JSON from the server
//       const extractionResponse = await axios.post("http://localhost:5000/api/resumes/extract", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const extractedData = extractionResponse.data.extracted;

//       // Step 2: Use the extracted data to generate the PDF on the server
//       const pdfResponse = await axios.post(
//         "http://localhost:5000/api/resumes/generate-company-resume",
//         extractedData,
//         {
//           responseType: "blob", // Important: tells axios to expect a file
//         }
//       );

//       // Step 3: Trigger the file download
//       const fileURL = window.URL.createObjectURL(new Blob([pdfResponse.data]));
//       const link = document.createElement("a");
//       link.href = fileURL;
//       link.setAttribute("download", "company_resume.pdf");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
      
//       alert("Resume successfully generated and downloaded!");

//     } catch (error) {
//       console.error("Failed to generate resume:", error);
//       alert("Failed to process resume. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2>Resume to Company Format Converter</h2>
//       <p>Upload a resume and get a company-formatted PDF instantly.</p>
//       <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
//       <button onClick={handleUpload} disabled={isProcessing}>
//         {isProcessing ? "Processing..." : "Upload & Generate PDF"}
//       </button>

//       {isProcessing && <p className="mt-2">Please wait, your resume is being processed.</p>}
//     </div>
//   );
// };

// export default UploadResume;



//taking the skills from the resume and generating a company format resume

// import React, { useState } from "react";
// import axios from "axios";

// const UploadResume: React.FC = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
//   const [extractedData, setExtractedData] = useState<any>(null);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) setFile(e.target.files[0]);
//   };

//   const handleExtract = async () => {
//     if (!file) {
//       alert("Please upload a resume file");
//       return;
//     }

//     setIsProcessing(true);

//     const formData = new FormData();
//     formData.append("resume", file);

//     try {
//       // Step 1: Extract data
//       const extractionResponse = await axios.post(
//         "http://localhost:5000/api/resumes/extract",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       const data = extractionResponse.data.extracted;
//       setExtractedData(data);

//       // Show skills if present
//       if (data.skills) {
//         setExtractedSkills(
//           typeof data.skills === "string"
//             ? data.skills.split(/,|\n/).map((s: string) => s.trim()).filter(Boolean)
//             : []
//         );
//       }
//       alert("Extraction successful! You can now generate the company format resume.");
//     } catch (error) {
//       console.error("Failed to extract resume:", error);
//       alert("Failed to process resume. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleGeneratePDF = async () => {
//     if (!extractedData) {
//       alert("No extracted data found. Please extract first.");
//       return;
//     }
//     setIsProcessing(true);
//     try {
//       const pdfResponse = await axios.post(
//         "http://localhost:5000/api/resumes/generate-company-resume",
//         extractedData,
//         { responseType: "blob" }
//       );

//       // Trigger download
//       const fileURL = window.URL.createObjectURL(new Blob([pdfResponse.data]));
//       const link = document.createElement("a");
//       link.href = fileURL;
//       link.setAttribute("download", "company_resume.pdf");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       alert("Resume successfully generated and downloaded!");
//     } catch (error) {
//       console.error("Failed to generate resume:", error);
//       alert("Failed to generate resume. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2>Resume to Company Format Converter</h2>
//       <p>Upload a resume and get a company-formatted PDF instantly.</p>
//       <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
//       <button onClick={handleExtract} disabled={isProcessing || !file}>
//         {isProcessing ? "Processing..." : "Extract Skills"}
//       </button>

//       {extractedSkills.length > 0 && (
//         <div style={{ marginTop: '20px' }}>
//           <h4>Extracted Skills</h4>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
//             {extractedSkills.map((skill, i) => (
//               <span
//                 key={i}
//                 style={{
//                   padding: '6px 10px',
//                   background: '#007bff',
//                   color: '#fff',
//                   borderRadius: '6px',
//                   fontSize: '14px',
//                 }}
//               >
//                 {skill}
//               </span>
//             ))}
//           </div>
//           <button
//             style={{ marginTop: '20px', padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer' }}
//             onClick={handleGeneratePDF}
//             disabled={isProcessing}
//           >
//             {isProcessing ? "Generating PDF..." : "Generate Company Format Resume"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadResume;



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
      const extractionResponse = await axios.post("http://localhost:5000/api/resumes/extract", formData, {
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
        "http://localhost:5000/api/resumes/resume-template",
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
