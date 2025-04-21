/* eslint-disable */
"use client";

import { Resume } from "components/Resume";
import React, { useState } from 'react';

export default function PageFix() {
  const [activeTab, setActiveTab] = useState<string>('defaultTab');
  
  return (
    <div>
      {activeTab === "resume" && (
        <div className="w-full h-full">
          <Resume />
        </div>
      )}
    </div>
  );
}