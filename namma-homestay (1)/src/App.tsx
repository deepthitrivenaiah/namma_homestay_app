/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Home, Download, Settings, Github } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center justify-center p-8 text-[#3E2723]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl bg-white p-12 rounded-3xl shadow-xl border border-[#2E7D32]/20 text-center"
      >
        <div className="w-20 h-20 bg-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Home className="text-white w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Namma HomeStay</h1>
        <p className="text-xl text-[#8D6E63] mb-8 font-medium">
          Android Studio Project Generated Successfully
        </p>
        
        <div className="space-y-6 text-left bg-[#FFF9F0] p-6 rounded-2xl mb-8 border border-[#8D6E63]/10">
          <h2 className="font-bold text-[#2E7D32] flex items-center gap-2">
            <Settings className="w-5 h-5" /> Next Steps:
          </h2>
          <ol className="list-decimal list-inside space-y-3 opacity-90">
            <li>Open the <b>Settings</b> menu in the sidebar</li>
            <li>Click <b>Export to ZIP</b> or <b>Export to GitHub</b></li>
            <li>Extract and open the folder in <b>Android Studio</b></li>
            <li>Sync Gradle and enjoy your rural homestay app!</li>
          </ol>
        </div>

        <div className="flex gap-4 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-full text-sm font-semibold">
                <Download className="w-4 h-4" /> Ready for Export
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#8D6E63] text-white rounded-full text-sm font-semibold">
                <Github className="w-4 h-4" /> Version 1.0
            </div>
        </div>
      </motion.div>
      
      <p className="mt-8 text-sm opacity-50 font-mono">
        android/com.nammahomestay.app • kotlin • xml • firestore
      </p>
    </div>
  );
}

