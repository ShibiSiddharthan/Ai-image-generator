import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import default_image from "../Assets/anime-girl.jpg";

const ImageGenerator = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let inputRef = useRef(null);

  const generateImages = async () => {
    if (inputRef.current.value === "") {
      alert("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://ai-image-generator3.p.rapidapi.com/generate",
        {
          method: "POST",
          headers: {
            "x-rapidapi-key":
              "b720a6549amshd31e18bcd159856p17658fjsn3862689f2378",
            "x-rapidapi-host": "ai-image-generator3.p.rapidapi.com",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            prompt: `${inputRef.current.value}`,
          }),
        }
      );
      let data = await response.json();

      if (data.results?.images?.length > 0) {
        setImageUrls(data.results.images);
      } else {
        console.error("No images in response:", data);
        alert("No images were generated");
      }
    } catch (error) {
      console.error("Error generating images:", error);
      alert("Error generating images");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-image--generator">
      <div className="header">
        Ai Image<span> Generator</span>
      </div>
      <div className="imageLoading">
        {isLoading ? (
          <div className="loading">Generating images...</div>
        ) : imageUrls.length > 0 ? (
          <div className="image-grid">
            {imageUrls.map((url, index) => (
              <div key={index} className="image-container">
                <img src={url} alt={`Generated image ${index + 1}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className="image">
            <img src={default_image} alt="Default placeholder" />
          </div>
        )}
      </div>
      <div className="search">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder="Type your imagination"
          disabled={isLoading}
        />
        <div
          className={`generate-btn ${isLoading ? "disabled" : ""}`}
          onClick={!isLoading ? generateImages : null}
        >
          {isLoading ? "Generating..." : "Generate"}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
