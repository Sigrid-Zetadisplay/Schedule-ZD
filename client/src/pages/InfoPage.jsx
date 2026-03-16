import React from "react";

export default function InfoPage() {
  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Info</h1>

      <p>
        This page can contain internal documentation, routines, campaign
        guidelines, contacts, or operational notes for the Coop retail media
        workflow.
      </p>

      <ul style={{ marginTop: "1rem", lineHeight: "1.6" }}>
        <li>Campaign setup routines</li>
        <li>Ad format specifications</li>
        <li>Contact persons</li>
        <li>Operational checklists</li>
      </ul>
    </div>
  );
}