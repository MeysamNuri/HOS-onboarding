
interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let pendingPrompt: InstallPromptEvent | null = null;
let installed = false;
let prompting = false;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  pendingPrompt = event as InstallPromptEvent;
});

window.addEventListener("appinstalled", () => {
  installed = true;
  pendingPrompt = null;
});

export async function installApp() {
  const standalone = (navigator as Navigator & { standalone?: boolean }).standalone;
  if (installed || standalone || window.matchMedia("(display-mode: standalone)").matches) return "installed";
  if (prompting) return "pending";
  if (!pendingPrompt) return "unavailable";
  const prompt = pendingPrompt;
  pendingPrompt = null;
  prompting = true;
  try {
    await prompt.prompt();
    return (await prompt.userChoice).outcome;
  } finally {
    prompting = false;
  }
}
