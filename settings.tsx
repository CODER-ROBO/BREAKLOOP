import { ArrowLeft, Download, Shield, Trash2, ChevronRight } from "lucide-react";
import { PanelType } from "@/pages/home";
import { useToast } from "@/hooks/use-toast";
import QuoteCarousel from "@/components/quote-carousel";

interface SettingsProps {
  onNavigate: (panel: PanelType) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  const { toast } = useToast();

  const handleExportData = () => {
    toast({ title: "Data export started", description: "Your data will be downloaded shortly" });
  };

  const handleDeleteAllData = () => {
    if (window.confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
      toast({ title: "All data deleted", description: "Your screen time data has been cleared" });
    }
  };

  return (
    <div className="bg-[var(--dark-bg)] overflow-y-auto h-full">
      <div className="p-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate("dashboard")}
            className="p-2 rounded-lg bg-[var(--dark-surface)] hover:bg-[var(--dark-elevated)] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Settings</h2>
          <div className="w-10"></div>
        </div>

        {/* Profile Section */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Profile</h3>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-bold">
              👤
            </div>
            <div className="ml-4">
              <div className="font-semibold text-lg">BREAKLOOP User</div>
              <div className="text-[var(--text-secondary)]">user@breakloop.app</div>
            </div>
          </div>
          <button className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors">
            Edit Profile
          </button>
        </div>

        {/* Data & Privacy */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Data & Privacy</h3>
          <div className="space-y-4">
            <button 
              onClick={handleExportData}
              className="w-full flex items-center justify-between p-4 bg-[var(--dark-elevated)] rounded-lg hover:bg-[var(--dark-elevated)]/80 transition-colors"
            >
              <div className="flex items-center">
                <Download className="w-5 h-5 mr-3" />
                <span>Export Data</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-[var(--dark-elevated)] rounded-lg hover:bg-[var(--dark-elevated)]/80 transition-colors">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-3" />
                <span>Privacy Settings</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={handleDeleteAllData}
              className="w-full flex items-center justify-between p-4 bg-[var(--destructive)]/10 text-[var(--destructive)] rounded-lg hover:bg-[var(--destructive)]/20 transition-colors"
            >
              <div className="flex items-center">
                <Trash2 className="w-5 h-5 mr-3" />
                <span>Delete All Data</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">App Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Always enabled for better focus
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked disabled />
                <div className="w-11 h-6 bg-[var(--primary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  Goal reminders and break alerts
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-[var(--dark-elevated)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary)]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Inspirational Quotes */}
        <div className="mb-6">
          <QuoteCarousel category="wellness" autoAdvance={true} interval={10000} />
        </div>

        {/* About */}
        <div className="bg-[var(--dark-surface)] rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">About BREAKLOOP</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Version</span>
              <span>1.0.0 (Free)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">License</span>
              <span className="text-[var(--success)] font-medium">100% Free</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Support</span>
              <button className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors">
                Contact Us
              </button>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Rate App</span>
              <button className="text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors">
                ⭐⭐⭐⭐⭐
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
