import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateResumePDF = (profile, userName, userEmail = "") => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const leftColWidth = 70; // width for left column
  const rightColX = margin + leftColWidth + 8; // start x for right column
  const rightColWidth = pageWidth - rightColX - margin;

  // Colors
  const primaryColor = [40, 40, 100]; // dark blue
  const secondaryColor = [80, 80, 120]; // muted blue

  // ----- Header -----
  doc.setFontSize(26);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(userName, margin, 25);
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(profile.headline || "Professional", margin, 33);
  doc.setDrawColor(180, 180, 200);
  doc.line(margin, 38, pageWidth - margin, 38);

  // ----- Left Column -----
  let leftY = 48;

  // Contact Section
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont(undefined, "bold");
  doc.text("CONTACT", margin, leftY);
  doc.setFont(undefined, "normal");
  doc.setTextColor(0, 0, 0);
  leftY += 6;

  if (userEmail) {
    doc.text(`Email: ${userEmail}`, margin, leftY);
    leftY += 5;
  }
  if (profile.phone) {
    doc.text(`Phone: ${profile.phone}`, margin, leftY);
    leftY += 5;
  }
  if (profile.location) {
    doc.text(`Location: ${profile.location}`, margin, leftY);
    leftY += 5;
  }
  if (profile.linkedin) {
    doc.text(`LinkedIn: ${profile.linkedin}`, margin, leftY, {
      maxWidth: leftColWidth,
    });
    leftY += 5;
  }
  if (profile.github) {
    doc.text(`GitHub: ${profile.github}`, margin, leftY, {
      maxWidth: leftColWidth,
    });
    leftY += 5;
  }
  leftY += 5;

  // Skills Section – using autoTable for better layout
  if (profile.skills && profile.skills.length) {
    doc.setFont(undefined, "bold");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("SKILLS", margin, leftY);
    doc.setFont(undefined, "normal");
    leftY += 6;
    const skillsData = profile.skills.map((skill) => [skill]);
    autoTable(doc, {
      startY: leftY,
      margin: { left: margin },
      body: skillsData,
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 1, textColor: [0, 0, 0] },
      columnStyles: { 0: { cellWidth: leftColWidth } },
      tableWidth: leftColWidth,
    });
    leftY = doc.lastAutoTable.finalY + 5;
  }

  // Education Section – using autoTable
  if (profile.education && profile.education.length) {
    doc.setFont(undefined, "bold");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("EDUCATION", margin, leftY);
    doc.setFont(undefined, "normal");
    leftY += 6;
    const eduData = profile.education.map((edu) => [
      `${edu.degree}\n${edu.institution}, ${edu.year}`,
    ]);
    autoTable(doc, {
      startY: leftY,
      margin: { left: margin },
      body: eduData,
      theme: "plain",
      styles: { fontSize: 9, cellPadding: 1, textColor: [0, 0, 0] },
      columnStyles: { 0: { cellWidth: leftColWidth } },
      tableWidth: leftColWidth,
    });
    leftY = doc.lastAutoTable.finalY + 5;
  }

  // ----- Right Column -----
  let rightY = 48;

  // Summary
  if (profile.summary) {
    doc.setFont(undefined, "bold");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("SUMMARY", rightColX, rightY);
    doc.setFont(undefined, "normal");
    doc.setTextColor(0, 0, 0);
    rightY += 6;
    const summaryLines = doc.splitTextToSize(profile.summary, rightColWidth);
    doc.text(summaryLines, rightColX, rightY);
    rightY += summaryLines.length * 5 + 5;
  }

  // Experience
  if (profile.experience && profile.experience.length) {
    doc.setFont(undefined, "bold");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("EXPERIENCE", rightColX, rightY);
    doc.setFont(undefined, "normal");
    doc.setTextColor(0, 0, 0);
    rightY += 6;
    profile.experience.forEach((exp) => {
      doc.setFont(undefined, "bold");
      doc.text(`${exp.title} at ${exp.company}`, rightColX, rightY);
      doc.setFont(undefined, "normal");
      rightY += 4;
      doc.text(`${exp.startDate} – ${exp.endDate}`, rightColX, rightY);
      rightY += 5;
      const descLines = doc.splitTextToSize(
        exp.description || "",
        rightColWidth,
      );
      doc.text(descLines, rightColX, rightY);
      rightY += descLines.length * 5 + 5;
    });
  }

  // Projects
  if (profile.projects && profile.projects.length) {
    doc.setFont(undefined, "bold");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("PROJECTS", rightColX, rightY);
    doc.setFont(undefined, "normal");
    doc.setTextColor(0, 0, 0);
    rightY += 6;
    profile.projects.forEach((proj) => {
      doc.setFont(undefined, "bold");
      doc.text(proj.name, rightColX, rightY);
      doc.setFont(undefined, "normal");
      rightY += 4;
      const descLines = doc.splitTextToSize(
        proj.description || "",
        rightColWidth,
      );
      doc.text(descLines, rightColX, rightY);
      rightY += descLines.length * 5;
      if (proj.technologies && proj.technologies.length) {
        doc.text(`Tech: ${proj.technologies.join(", ")}`, rightColX, rightY);
        rightY += 5;
      }
      rightY += 3;
    });
  }

  // Save PDF
  const fileName = `${userName.replace(/\s+/g, "_")}_Resume.pdf`;
  doc.save(fileName);
};
