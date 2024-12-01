import React from "react";
import CourseSessionList from "./CourseSessionList"; // Importiere die aktualisierte CourseList-Komponente

const EnrollPage = ({ userId }) => {
  return (
    <div>
      <h1>Anmeldung zu Kursen</h1>
      <p>Hier können Sie sich für verfügbare Kurse anmelden.</p>
      {/* Übergabe der userId an die CourseList-Komponente */}
      <CourseSessionList userId={userId} />
    </div>
  );
};

export default EnrollPage;
