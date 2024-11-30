import React from 'react';
//import './HelpSite.css'; // Falls du später ein CSS für das Styling hinzufügst

const HelpSite = () => {
  return (
    <div className="help-container">
      <h1>Hilfe & Anleitung</h1>
      <section className="intro">
        <h2>Willkommen zur WebApp!</h2>
        <p>
          Dies ist eine Webanwendung, die es Nutzern ermöglicht, sich für verschiedene
          Kurse anzumelden, ihren Kalender zu verwalten und mit anderen Teilnehmern zu
          interagieren. Die App bietet eine einfache Benutzeroberfläche und eine Vielzahl
          von Funktionen zur Kursverwaltung. (Platzhalter: Hier könnte Ihre Beschreibung
          der Anwendung stehen.)
        </p>
      </section>

      <section className="features">
        <h2>Funktionen der WebApp</h2>
        <ul>
          <li>Durchsuchen von verfügbaren Kursen</li>
          <li>Anmeldung zu Kursen mit Kalenderintegration</li>
          <li>Überprüfen und Verwalten von eigenen Kursanmeldungen</li>
          <li>Abmeldung von Kursen und Kalenderaktualisierungen</li>
          <li>Verwalten von Kalenderereignissen für Dozenten</li>
        </ul>
      </section>

      <section className="version">
        <h2>Version</h2>
        <p>Version: 1.0.0</p>
        <p>Die aktuelle Version bietet eine stabile Benutzererfahrung mit den grundlegenden Funktionen zur Kursanmeldung.</p>
      </section>

      <section className="developer-info">
        <h2>Entwickler</h2>
        <p>
          Diese Anwendung wurde von folgenden Entwicklern erstellt:
        </p>
        <ul>
          <li>Max Mustermann - Frontend-Entwickler</li>
          <li>Lisa Beispiel - Backend-Entwicklerin</li>
          <li>John Doe - Projektmanager</li>
        </ul>
        <p>Kontakt: kontakt@developerteam.com</p>
      </section>

      <section className="faq">
        <h2>Häufig gestellte Fragen (FAQ)</h2>
        <h3>Wie melde ich mich zu einem Kurs an?</h3>
        <p>Um sich für einen Kurs anzumelden, klicken Sie einfach auf den "Anmelden"-Button neben dem Kurs, der Sie interessiert. Falls bereits alle Plätze belegt sind, wird der Button deaktiviert.</p>

        <h3>Kann ich mich von einem Kurs abmelden?</h3>
        <p>Ja, Sie können sich jederzeit von einem Kurs abmelden, solange noch keine Konflikte mit Ihrem Kalender bestehen. Klicken Sie auf den "Abmelden"-Button, um den Kurs zu verlassen.</p>
        
        <h3>Wie kann ich meine persönlichen Daten ändern?</h3>
        <p>Aktuell können Sie Ihre persönlichen Daten über die WebApp nicht ändern. Bitte wenden Sie sich an den Support, falls Änderungen erforderlich sind.</p>
      </section>

      <section className="contact">
        <h2>Kontakt</h2>
        <p>
          Bei Fragen oder Problemen wenden Sie sich bitte an unseren Support:
        </p>
        <p>Email: support@developerteam.com</p>
        <p>Telefon: +123 456 7890</p>
      </section>
    </div>
  );
};

export default HelpSite;
