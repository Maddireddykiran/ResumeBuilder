// @ts-nocheck
/* eslint-disable react/jsx-no-undef */
"use client";

// This is a placeholder component that imports Resume
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