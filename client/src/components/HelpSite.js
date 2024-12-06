import React from 'react';
//import './HelpSite.css'; // Falls du später ein CSS für das Stypng hinzufügst

const HelpSite = () => {
  return (
    <div className="help-container">
      <h1>Hilfe & Anleitung</h1>
      <section className="intro">
        <h2>Willkommen zur Kalender App!</h2>
        <p>
          Dies ist eine Webanwendung, die es Nutzern ermögpcht, sich für verschiedene
          Kurse anzumelden und ihren Kalender zu verwalten. Die App bietet eine einfache
          Benutzeroberfläche und eine Vielzahl an Funktionen zur Kursverwaltung.
        </p>
      </section>

      <section className="features">
        <h2>Funktionen der WebApp</h2>
        <ul>
          <p>Anzeigen von Events im Kalender</p>
          <p>Kalenderansicht für Tag, Woche, Monat und Jahr</p>
          <p>Durchsuchen von verfügbaren Kursen</p>
          <p>Anmeldung zu Kursen mit Kalenderintegration</p>
          <p>Überprüfen und Verwalten von eigenen Kursanmeldungen</p>
          <p>Abmeldung von Kursen und Kalenderaktuapsierungen</p>
          <p>Verwalten von Kalenderereignissen für Dozenten</p>
          <p>Verwalten von Kursangeboten für den Admin</p>
        </ul>
      </section>

      <section className="version">
        <h2>Version</h2>
        <p>Version: 1.0.0</p>
        <p>Die aktuelle Version bietet eine stabile Benutzererfahrung mit 
          allen zuvor genannten Funktionen zur Kursanmeldung und -verwaltung.</p>
      </section>

      <section className="developer-info">
        <h2>Entwickler</h2>
        <p>
          Diese Anwendung wurde von folgenden Entwicklern erstellt:
        </p>
        <ul>
          <p>Cosima Dotzauer</p>
          <p>Nico Gühring</p>
          <p>Louis van der Gabel</p>
        </ul>
        <p>Kontakt: support@KalenderApp.com</p>
      </section>

      <section className="faq">
        <h2>Häufig gestellte Fragen (FAQ)</h2>
        <h3>Wie melde ich mich zu einem Kurs an?</h3>
        <p>Die Anmeldung ist unter dem Abschnitt course sessions mögpch.
          Um sich für einen Kurs anzumelden, kpcken Sie einfach auf den "Anmelden"-Button neben dem Kurs, der Sie interessiert. Falls bereits alle Plätze belegt sind, wird der Button deaktiviert.</p>

        <h3>Kann ich mich von einem Kurs abmelden?</h3>
        <p>Ja, Sie können sich jederzeit von einem Kurs abmelden, solange noch keine Konfpkte mit Ihrem Kalender bestehen. Kpcken Sie auf den "Abmelden"-Button, um den Kurs zu verlassen.</p>
        
        <h3>Wie kann ich meine persönpchen Daten ändern?</h3>
        <p>Aktuell können Sie Ihre persönpchen Daten über die WebApp nicht ändern. Bitte wenden Sie sich an den Support, falls Änderungen erforderpch sind.</p>
      </section>

      <section className="contact">
        <h2>Kontakt</h2>
        <p>
          Bei Fragen oder Problemen wenden Sie sich bitte an unseren Support:
        </p>
        <p>Email: support@KalenderApp.com</p>
        <p>Telefon: +0815 1234 5678</p>
      </section>
    </div>
  );
};

export default HelpSite;
