import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  SkillBox,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeSkills } from "lib/redux/types";

export const ResumePDFSkills = ({
  heading,
  skills,
  themeColor,
  showBulletPoints,
}: {
  heading: string;
  skills: ResumeSkills;
  themeColor: string;
  showBulletPoints: boolean;
}) => {
  // Ensure skills data is valid
  const descriptions = Array.isArray(skills.descriptions) ? skills.descriptions : [];
  const featuredSkills = Array.isArray(skills.featuredSkills) ? skills.featuredSkills : [];
  
  // Filter out empty skills
  const featuredSkillsWithText = featuredSkills.filter((item) => item && typeof item === 'object' && item.skill);
  
  // Create a map to group skills by category
  const skillsByCategory: Record<string, string[]> = {};
  const uncategorizedSkills: string[] = [];
  
  // Process featured skills first
  featuredSkillsWithText.forEach(fs => {
    if (fs.skill) {
      // Check if this is a category with skills (e.g., "Languages: Java, Python")
      const categoryMatch = fs.skill.match(/^([^:]+):\s*(.+)$/);
      
      if (categoryMatch) {
        // This is a category with skills
        const category = categoryMatch[1].trim();
        const skillText = categoryMatch[2].trim();
        
        if (!skillsByCategory[category]) {
          skillsByCategory[category] = [];
        }
        
        skillsByCategory[category].push(skillText);
      } else {
        // This is just a single skill without category
        uncategorizedSkills.push(fs.skill);
      }
    }
  });
  
  // Process skills descriptions
  descriptions.forEach(desc => {
    if (desc && desc.length > 0) {
      // Check if this is a category with skills (e.g., "Frontend: React.js, HTML, CSS")
      const categoryMatch = desc.match(/^([^:]+):\s*(.+)$/);
      
      if (categoryMatch) {
        // This is a category with skills
        const category = categoryMatch[1].trim();
        const skillsText = categoryMatch[2].trim();
        
        // Split the skills by comma
        const skillsInCategory = skillsText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        if (!skillsByCategory[category]) {
          skillsByCategory[category] = [];
        }
        
        // Add each individual skill to its category
        skillsByCategory[category].push(...skillsInCategory);
      } else if (desc.includes(',')) {
        // This is just a comma-separated list without a category
        const skillsFromDesc = desc.split(',').map(s => s.trim()).filter(s => s.length > 0);
        uncategorizedSkills.push(...skillsFromDesc);
      } else {
        // Single skill
        uncategorizedSkills.push(desc.trim());
      }
    }
  });
  
  // Remove duplicates within each category
  Object.keys(skillsByCategory).forEach(category => {
    skillsByCategory[category] = Array.from(new Set(skillsByCategory[category]));
  });
  
  // Remove duplicates from uncategorized skills
  const uniqueUncategorizedSkills = Array.from(new Set(uncategorizedSkills));

  return (
    <ResumePDFSection themeColor={themeColor} heading={heading}>
      {/* Display categorized skills */}
      {Object.keys(skillsByCategory).map((category, categoryIndex) => (
        <View key={categoryIndex} style={{ marginBottom: spacing[3] }}>
          <View style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            flexWrap: 'wrap',
            marginTop: spacing[1],
            marginBottom: spacing[1]
          }}>
            {/* Display the category label as the first box */}
            <View 
              style={{
                margin: spacing[1],
                padding: `${spacing[1]} ${spacing[2]}`,
                backgroundColor: "#f0f0f0",
                borderRadius: spacing[1],
                borderWidth: 0.5,
                borderColor: "#d0d0d0"
              }}
            >
              <ResumePDFText style={{ fontSize: 9, fontWeight: 'bold', color: "#333" }}>
                {category}:
              </ResumePDFText>
            </View>
            
            {/* Display the skills in this category */}
            {skillsByCategory[category].map((skill, skillIndex) => (
              <SkillBox 
                key={skillIndex} 
                skill={skill} 
                themeColor={themeColor}
              />
            ))}
          </View>
        </View>
      ))}
      
      {/* Display uncategorized skills if any */}
      {uniqueUncategorizedSkills.length > 0 && (
        <View style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          marginTop: spacing[1],
          marginBottom: spacing[1]
        }}>
          {uniqueUncategorizedSkills.map((skill, index) => (
            <SkillBox 
              key={index} 
              skill={skill} 
              themeColor={themeColor}
            />
          ))}
        </View>
      )}
    </ResumePDFSection>
  );
};
