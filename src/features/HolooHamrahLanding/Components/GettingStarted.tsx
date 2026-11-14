import { installationSteps } from "../data/landingData";

export default function GettingStarted() {
  const downloadUrl = "https://portfolio.invalid/hos/HolooHamrah-Production-1.1.1196.exe";

  return (
    <section className="hamrah-steps hamrah-container" aria-labelledby="hamrah-steps-title">
      <h2 id="hamrah-steps-title">در ۳ مرحله، هلو را همراه خود داشته باشید</h2>
      <div className="hamrah-steps__grid">
        {installationSteps.map((step, index) => (
          <article className="hamrah-step" key={step.title}>
            <h3><span>{index + 1}</span>{step.title}</h3>
            <p>{step.description}</p>
            {index === 0 && (
              <a className="hamrah-button" href={downloadUrl}>دانلود هلو همراه</a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
