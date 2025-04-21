import { Resume } from "components/Resume";
import React, { useState } from 'react';
const [activeTab, setActiveTab] = useState<string>('defaultTab');
{activeTab === "resume" && (
  <div className="w-full h-full">
    <Resume />
  </div>
)} 