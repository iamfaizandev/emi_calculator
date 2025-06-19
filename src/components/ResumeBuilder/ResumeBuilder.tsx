"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { Download, Plus, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";

interface Education {
  degree: string;
  college: string;
  year: string;
}

interface Project {
  title: string;
  description: string;
  link: string;
}

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  linkedIn: string;
  github: string;
  education: Education[];
  skills: string;
  projects: Project[];
  hobbies: string;
  certifications: string;
}

const containerVariants: HTMLMotionProps<"div">["variants"] = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, ease: "easeOut" },
  },
};

const itemVariants: HTMLMotionProps<"div">["variants"] = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const ResumeBuilder: React.FC = () => {
  const [formData, setFormData] = useState<ResumeData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedIn: "",
    github: "",
    education: [{ degree: "", college: "", year: "" }],
    skills: "",
    projects: [{ title: "", description: "", link: "" }],
    hobbies: "",
    certifications: "",
  });
  const previewRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ResumeData
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setFormData({ ...formData, education: updatedEducation });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: "", college: "", year: "" }],
    });
  };

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      const updatedEducation = formData.education.filter((_, i) => i !== index);
      setFormData({ ...formData, education: updatedEducation });
    }
  };

  const handleProjectChange = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData({ ...formData, projects: updatedProjects });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        { title: "", description: "", link: "" },
      ],
    });
  };

  const removeProject = (index: number) => {
    if (formData.projects.length > 1) {
      const updatedProjects = formData.projects.filter((_, i) => i !== index);
      setFormData({ ...formData, projects: updatedProjects });
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const margin = 20;
    let y = margin;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(formData.fullName || "Your Name", margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const contactInfo = [
      formData.email,
      formData.phone,
      formData.address,
      formData.linkedIn,
      formData.github,
    ]
      .filter(Boolean)
      .join(" | ");
    doc.text(contactInfo, margin, y);
    y += 10;

    // Line
    doc.setLineWidth(0.5);
    doc.line(margin, y, 190, y);
    y += 10;

    // Education
    if (
      formData.education.some((edu) => edu.degree || edu.college || edu.year)
    ) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Education", margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      formData.education.forEach((edu) => {
        if (edu.degree || edu.college || edu.year) {
          const eduText = `${edu.degree}${
            edu.college ? `, ${edu.college}` : ""
          }${edu.year ? `, ${edu.year}` : ""}`;
          doc.text(eduText, margin, y);
          y += 6;
        }
      });
      y += 5;
    }

    // Skills
    if (formData.skills) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Skills", margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const skills = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      doc.text(skills.join(" | "), margin, y);
      y += 10;
    }

    // Projects
    if (
      formData.projects.some(
        (proj) => proj.title || proj.description || proj.link
      )
    ) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Projects", margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      formData.projects.forEach((proj) => {
        if (proj.title || proj.description || proj.link) {
          doc.setFont("helvetica", "bold");
          doc.text(proj.title || "Project", margin, y);
          y += 6;
          if (proj.description) {
            const descLines = doc.splitTextToSize(proj.description, 170);
            descLines.forEach((line: string) => {
              doc.setFont("helvetica", "normal");
              doc.text(line, margin, y);
              y += 5;
            });
          }
          if (proj.link) {
            doc.setTextColor(0, 0, 255);
            doc.textWithLink(proj.link, margin, y, { url: proj.link });
            doc.setTextColor(0, 0, 0);
            y += 6;
          }
          y += 2;
        }
      });
      y += 5;
    }

    // Hobbies
    if (formData.hobbies) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Hobbies & Interests", margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(formData.hobbies, margin, y);
      y += 10;
    }

    // Certifications
    if (formData.certifications) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Certifications", margin, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const certLines = doc.splitTextToSize(formData.certifications, 170);
      certLines.forEach((line: string) => {
        doc.text(line, margin, y);
        y += 5;
      });
    }

    doc.save(`${formData.fullName || "resume"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-12"
        >
          Resume Builder
        </motion.h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8"
          >
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Enter Your Details
            </motion.h2>
            <motion.div className="space-y-6">
              {/* Personal Info */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange(e, "fullName")}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  aria-label="Full Name"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e, "email")}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    aria-label="Email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange(e, "phone")}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                    placeholder="+91 9876543210"
                    aria-label="Phone"
                  />
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange(e, "address")}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St, City, Country"
                  aria-label="Address"
                />
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label
                    htmlFor="linkedIn"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    LinkedIn
                  </label>
                  <input
                    id="linkedIn"
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => handleInputChange(e, "linkedIn")}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/johndoe"
                    aria-label="LinkedIn"
                  />
                </div>
                <div>
                  <label
                    htmlFor="github"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    GitHub
                  </label>
                  <input
                    id="github"
                    type="url"
                    value={formData.github}
                    onChange={(e) => handleInputChange(e, "github")}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/johndoe"
                    aria-label="GitHub"
                  />
                </div>
              </motion.div>

              {/* Education */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Education
                </h3>
                <AnimatePresence>
                  {formData.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 mb-4 border-b border-gray-200 dark:border-gray-600 pb-4"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor={`degree-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Degree
                          </label>
                          <input
                            id={`degree-${index}`}
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                            placeholder="B.Tech in Computer Science"
                            aria-label={`Degree ${index + 1}`}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`college-${index}`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            College
                          </label>
                          <input
                            id={`college-${index}`}
                            type="text"
                            value={edu.college}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "college",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                            placeholder="XYZ University"
                            aria-label={`College ${index + 1}`}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor={`year-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Year
                        </label>
                        <input
                          id={`year-${index}`}
                          type="text"
                          value={edu.year}
                          onChange={(e) =>
                            handleEducationChange(index, "year", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                          placeholder="2020-2024"
                          aria-label={`Year ${index + 1}`}
                        />
                      </div>
                      {formData.education.length > 1 && (
                        <button
                          onClick={() => removeEducation(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 flex items-center text-sm mt-2"
                          aria-label={`Remove education entry ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button
                  onClick={addEducation}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 flex items-center text-sm"
                  aria-label="Add another education entry"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Education
                </button>
              </motion.div>

              {/* Skills */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Skills (comma-separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  value={formData.skills}
                  onChange={(e) => handleInputChange(e, "skills")}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                  placeholder="JavaScript, React, Node.js"
                  aria-label="Skills"
                />
              </motion.div>

              {/* Projects */}
              <motion.div variants={itemVariants}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Projects
                </h3>
                <AnimatePresence>
                  {formData.projects.map((proj, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 mb-4 border-b border-gray-200 dark:border-gray-600 pb-4"
                    >
                      <div>
                        <label
                          htmlFor={`project-title-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Project Title
                        </label>
                        <input
                          id={`project-title-${index}`}
                          type="text"
                          value={proj.title}
                          onChange={(e) =>
                            handleProjectChange(index, "title", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                          placeholder="Portfolio Website"
                          aria-label={`Project Title ${index + 1}`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`project-description-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Description
                        </label>
                        <textarea
                          id={`project-description-${index}`}
                          value={proj.description}
                          onChange={(e) =>
                            handleProjectChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                          placeholder="Built a responsive portfolio using React and Tailwind CSS."
                          rows={3}
                          aria-label={`Project Description ${index + 1}`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor={`project-link-${index}`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Live Link
                        </label>
                        <input
                          id={`project-link-${index}`}
                          type="url"
                          value={proj.link}
                          onChange={(e) =>
                            handleProjectChange(index, "link", e.target.value)
                          }
                          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                          placeholder="https://portfolio.com"
                          aria-label={`Project Link ${index + 1}`}
                        />
                      </div>
                      {formData.projects.length > 1 && (
                        <button
                          onClick={() => removeProject(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 flex items-center text-sm mt-2"
                          aria-label={`Remove project entry ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button
                  onClick={addProject}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 flex items-center text-sm"
                  aria-label="Add another project entry"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Project
                </button>
              </motion.div>

              {/* Hobbies */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="hobbies"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Hobbies & Interests
                </label>
                <input
                  id="hobbies"
                  type="text"
                  value={formData.hobbies}
                  onChange={(e) => handleInputChange(e, "hobbies")}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                  placeholder="Reading, Hiking, Photography"
                  aria-label="Hobbies and Interests"
                />
              </motion.div>

              {/* Certifications */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="certifications"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Certifications (optional)
                </label>
                <textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange(e, "certifications")}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500"
                  placeholder="AWS Certified Developer, 2023"
                  rows={3}
                  aria-label="Certifications"
                />
              </motion.div>

              {/* Generate Button */}
              <motion.div variants={itemVariants}>
                <button
                  onClick={generatePDF}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-base font-semibold transition-all hover:scale-105"
                  aria-label="Generate and download resume PDF"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Generate Resume
                </button>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Preview Section */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8"
            ref={previewRef}
          >
            <motion.h2
              variants={itemVariants}
              className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Resume Preview
            </motion.h2>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {formData.fullName || "Your Name"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {[
                  formData.email,
                  formData.phone,
                  formData.address,
                  formData.linkedIn,
                  formData.github,
                ]
                  .filter(Boolean)
                  .join(" | ")}
              </p>
              <hr className="my-4 border-gray-300 dark:border-gray-600" />
              {formData.education.some(
                (edu) => edu.degree || edu.college || edu.year
              ) && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Education
                  </h2>
                  {formData.education.map(
                    (edu, index) =>
                      (edu.degree || edu.college || edu.year) && (
                        <p
                          key={index}
                          className="text-sm text-gray-600 dark:text-gray-300 mb-1"
                        >
                          {edu.degree}
                          {edu.college && `, ${edu.college}`}
                          {edu.year && `, ${edu.year}`}
                        </p>
                      )
                  )}
                </>
              )}
              {formData.skills && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                    Skills
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formData.skills
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                </>
              )}
              {formData.projects.some(
                (proj) => proj.title || proj.description || proj.link
              ) && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                    Projects
                  </h2>
                  {formData.projects.map(
                    (proj, index) =>
                      (proj.title || proj.description || proj.link) && (
                        <div key={index} className="mb-2">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {proj.title || "Project"}
                          </h3>
                          {proj.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {proj.description}
                            </p>
                          )}
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {proj.link}
                            </a>
                          )}
                        </div>
                      )
                  )}
                </>
              )}
              {formData.hobbies && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                    Hobbies & Interests
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formData.hobbies}
                  </p>
                </>
              )}
              {formData.certifications && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                    Certifications
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {formData.certifications}
                  </p>
                </>
              )}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeBuilder;
