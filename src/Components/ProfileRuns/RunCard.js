// src/Components/Profile/RunCard.js
// Formatting to display runs on a profile page
import React from "react";
import { useNavigate } from "react-router-dom";

export default function RunCard({ run, width = "200px" }) {
  const navigate = useNavigate();
  const distance = run.get("distance");
  const time = run.get("time");
  const pace = run.get("pace");
  const location = run.get("location");
  const date = run.get("date")
    ? new Date(run.get("date")).toLocaleDateString()
    : "";
  const taggedRunners = run.get("taggedRunners") || [];

  // Handle navigation to runner's profile
  const handleRunnerClick = (runnerId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (runnerId) {
      navigate(`/profile/${runnerId}`);
    }
  };

  // Format tagged runners display with clickable links
  const formatTaggedRunners = () => {
    if (taggedRunners.length === 0) return null;

    // Process runners to get name and ID
    const runners = taggedRunners.map((runner) => {
      if (runner && typeof runner.get === "function") {
        return {
          id: runner.id,
          name: runner.get("name") || "Unknown",
        };
      }
      return { id: null, name: "Unknown" };
    });

    // Filter out invalid runners
    const validRunners = runners.filter((r) => r.id);

    if (validRunners.length === 0) return null;

    // Render clickable runner name
    const renderRunnerLink = (runner) => {
      return (
        <span
          key={runner.id}
          onClick={(e) => handleRunnerClick(runner.id, e)}
          className="text-blue-500 cursor-pointer transition-all duration-200 hover:text-blue-700 hover:underline"
        >
          {runner.name}
        </span>
      );
    };

    if (validRunners.length === 1) {
      return (
        <span>
          with {renderRunnerLink(validRunners[0])}
        </span>
      );
    } else if (validRunners.length === 2) {
      return (
        <span>
          with {renderRunnerLink(validRunners[0])} and {renderRunnerLink(validRunners[1])}
        </span>
      );
    } else {
      const last = validRunners[validRunners.length - 1];
      const others = validRunners.slice(0, -1);
      return (
        <span>
          with {others.map((runner, index) => (
            <React.Fragment key={runner.id}>
              {renderRunnerLink(runner)}
              {index < others.length - 1 && ", "}
            </React.Fragment>
          ))}, and {renderRunnerLink(last)}
        </span>
      );
    }
  };

  return (
    <div
      className="border border-gray-300 rounded-xl p-4 m-4 text-center transition-transform duration-200"
      style={{ width }}
    >
      <h3 className="mb-2 text-lg font-bold">🏃‍♂️ Run</h3>
      <p className="mb-2">
        <strong>Distance:</strong> {distance} km
      </p>
      <p className="mb-2">
        <strong>Time:</strong> {time} minutes
      </p>
      <p className="mb-2">
        <strong>Pace:</strong> {pace} min/km
      </p>
      {location && (
        <p className="mb-2">
          <strong>Location:</strong> {location}
        </p>
      )}
      {taggedRunners.length > 0 && (
        <p className="text-sm mt-2 italic">
          {formatTaggedRunners()}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        {date && `Date: ${date}`}
      </p>
    </div>
  );
}