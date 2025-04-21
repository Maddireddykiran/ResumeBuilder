import { Page, View, Document } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";

/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */

// Helper to validate that an object has expected structure
const ensureValidObject = (obj: any, defaultObj: any): any => {
  if (!obj || typeof obj !== 'object') {
    return defaultObj;
  }
  return obj;
};

// Helper to ensure array has valid structure
const ensureValidArray = (arr: any, defaultArr: any[]): any[] => {
  if (!Array.isArray(arr)) {
    return defaultArr;
  }
  return arr;
};

export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  // Validate resume parts to prevent rendering errors
  const safeResume = {
    profile: ensureValidObject(resume.profile, {}),
    workExperiences: ensureValidArray(resume.workExperiences, []),
    educations: ensureValidArray(resume.educations, []),
    projects: ensureValidArray(resume.projects, []),
    skills: ensureValidObject(resume.skills, { featuredSkills: [], descriptions: [] }),
    custom: ensureValidObject(resume.custom, { descriptions: [] })
  };
  
  const { profile, workExperiences, educations, projects, skills, custom } = safeResume;
  const name = profile.name || 'Resume';
  
  const safeSettings = ensureValidObject(settings, {
    fontFamily: 'sans-serif',
    fontSize: '12',
    documentSize: 'LETTER',
    formToHeading: {},
    formToShow: {},
    formsOrder: [],
    showBulletPoints: {}
  });
  
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    showBulletPoints,
  } = safeSettings;
  const themeColor = safeSettings.themeColor || DEFAULT_FONT_COLOR;

  const showFormsOrder = Array.isArray(formsOrder) ? formsOrder.filter((form) => formToShow && formToShow[form]) : [];

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading && formToHeading["workExperiences"] || "WORK EXPERIENCE"}
        workExperiences={workExperiences}
        themeColor={themeColor}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading && formToHeading["educations"] || "EDUCATION"}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints && showBulletPoints["educations"]}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading && formToHeading["projects"] || "PROJECTS"}
        projects={projects}
        themeColor={themeColor}
      />
    ),
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading && formToHeading["skills"] || "SKILLS"}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints && showBulletPoints["skills"]}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading && formToHeading["custom"] || "CUSTOM"}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={showBulletPoints && showBulletPoints["custom"]}
      />
    ),
  };

  return (
    <>
      <Document title={`${name} Resume`} author={name} producer={"MKR"}>
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            ...styles.flexCol,
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + "pt",
          }}
        >
          {Boolean(safeSettings.themeColor) && (
            <View
              style={{
                width: spacing["full"],
                height: spacing[3.5],
                backgroundColor: themeColor,
              }}
            />
          )}
          <View
            style={{
              ...styles.flexCol,
              padding: `${spacing[0]} ${spacing[20]}`,
            }}
          >
            <ResumePDFProfile
              profile={profile}
              themeColor={themeColor}
              isPDF={isPDF}
            />
            {showFormsOrder.map((form) => {
              // Ensure form is a valid ShowForm type
              if (form in formTypeToComponent) {
                const Component = formTypeToComponent[form as ShowForm];
                return <Component key={form} />;
              }
              return null;
            })}
          </View>
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
