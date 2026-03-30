const ACCESSIBILITY_SETTINGS_KEY = "mooshieui.accessibility.v1";

export type VisionSimulatorMode = "none" | "protanopia" | "deuteranopia" | "tritanopia";

class AccessibilityStore {
  visionSimulatorMode = $state<VisionSimulatorMode>("none");
  showInfoTips = $state(true);

  constructor() {
    this.loadSettings();
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem(ACCESSIBILITY_SETTINGS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.visionSimulatorMode) {
        this.visionSimulatorMode = parsed.visionSimulatorMode;
      }
      if (parsed.showInfoTips !== undefined) {
        this.showInfoTips = parsed.showInfoTips;
      }
    } catch (e) {
      console.error("Failed to load accessibility settings:", e);
    }
  }

  saveSettings() {
    try {
      localStorage.setItem(ACCESSIBILITY_SETTINGS_KEY, JSON.stringify({
        visionSimulatorMode: this.visionSimulatorMode,
        showInfoTips: this.showInfoTips
      }));
    } catch (e) {
      console.error("Failed to save accessibility settings:", e);
    }
  }

  setVisionSimulatorMode(mode: VisionSimulatorMode) {
    this.visionSimulatorMode = mode;
    this.saveSettings();
  }
}

export const accessibility = new AccessibilityStore();
