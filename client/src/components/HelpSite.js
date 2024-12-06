import React from "react";

const HelpSite = () => {
  return (
    <div className="help-container" style={{ padding: "20px", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Hilfe & Anleitung</h1>

      <section className="intro" style={{ marginBottom: "20px" }}>
        
        <p>
          Dies ist eine Webanwendung, die es Nutzern ermöglicht, sich für verschiedene
          Kurse anzumelden und ihren Kalender zu verwalten. Die App bietet eine einfache
          Benutzeroberfläche und eine Vielzahl an Funktionen zur Kursverwaltung.
        </p>
      </section>

      <section className="features" style={{ marginBottom: "20px" }}>
        <h2>Funktionen der App</h2>
        <ul>
          <li>Anzeigen von Events im Kalender</li>
          <li>Kalenderansicht für Tag, Woche, Monat und Jahr</li>
          <li>Durchsuchen von verfügbaren Kursen</li>
          <li>Anmeldung zu Kursen mit Kalenderintegration</li>
          <li>Überprüfen und Verwalten von eigenen Kursanmeldungen</li>
          <li>Abmeldung von Kursen und Kalenderaktualisierungen</li>
          <li>Verwalten von Kalenderereignissen für Dozenten</li>
          <li>Verwalten von Kursangeboten für den Admin</li>
        </ul>
      </section>

      <section className="version" style={{ marginBottom: "20px" }}>
        <h2>Version</h2>
        <p><strong>Version:</strong> 1.0.0</p>
        <p>
          Die aktuelle Version bietet eine stabile Benutzererfahrung mit 
          allen zuvor genannten Funktionen zur Kursanmeldung und -verwaltung.
        </p>
      </section>

      <section className="developer-info" style={{ marginBottom: "20px" }}>
        <h2>Entwickler</h2>
        <p>Diese Anwendung wurde von folgenden Entwicklern erstellt:</p>
        <ul>
          <li>Cosima Dotzauer</li>
          <li>Nico Gühring</li>
          <li>Louis van der Gabel</li>
        </ul>
         </section>

      <section className="faq" style={{ marginBottom: "20px" }}>
        <h2>Häufig gestellte Fragen (FAQ)</h2>

        <h4>Wie melde ich mich zu einem Kurs an?</h4>
        <p>
          Die Anmeldung ist unter dem Abschnitt **Anmeldungen** möglich.
          Um sich für einen Kurs anzumelden, klicken Sie einfach auf den 
          **„Anmelden“**-Button neben dem Kurs, der Sie interessiert. Falls 
          bereits alle Plätze belegt sind, wird eine Fehlermeldung angezeigt.
        </p>

        <h4>Kann ich mich von einem Kurs abmelden?</h4>
        <p>
          Ja, Sie können sich jederzeit von einem Kurs abmelden. Klicken Sie 
          auf den **„Abmelden“**-Button, um den Kurs zu verlassen.
        </p>
        
        <h4>Wie kann ich meine persönlichen Daten ändern?</h4>
        <p>
          Aktuell können Sie Ihre persönlichen Daten über die WebApp nicht 
          ändern. Bitte wenden Sie sich an den Support, falls Änderungen erforderlich sind.
        </p>
      </section>

      <section className="contact" style={{ marginBottom: "20px" }}>
        <h2>Kontakt</h2>
        <p>Bei Fragen oder Problemen wenden Sie sich bitte an unseren Support:</p>
        <ul>
          <li>Email: support@KalenderApp.com</li>
          <li>Telefon: +0815 1234 5678</li>
        </ul>
      </section>
    </div>
  );
};

export default HelpSite;
