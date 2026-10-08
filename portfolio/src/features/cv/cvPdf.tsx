import {
  Document,
  Font,
  Link,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import notoSansRegular from "@fontsource/noto-sans/files/noto-sans-cyrillic-400-normal.woff?url";
import notoSansBold from "@fontsource/noto-sans/files/noto-sans-cyrillic-700-normal.woff?url";
import notoSansMonoRegular from "@fontsource/noto-sans-mono/files/noto-sans-mono-cyrillic-400-normal.woff?url";
import notoSansMonoBold from "@fontsource/noto-sans-mono/files/noto-sans-mono-cyrillic-700-normal.woff?url";
import { profile } from "../../app/profile";
import type { Certificate, Education, Skill, WorkExperience } from "../../api/types";
import { formatRange } from "./cvData";
import { parsePdfDescription, pdfBulletForLevel } from "./cvPdfMarkdown";

export const CV_PDF_FILENAME = "Nurzhanat_Zhussup_CV.pdf";

Font.register({
  family: "Noto Sans",
  fonts: [
    { src: notoSansRegular, fontWeight: 400 },
    { src: notoSansBold, fontWeight: 700 },
  ],
});
Font.register({
  family: "Noto Sans Mono",
  fonts: [
    { src: notoSansMonoRegular, fontWeight: 400 },
    { src: notoSansMonoBold, fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

export type CvPdfLabels = {
  title: string;
  experience: string;
  education: string;
  skills: string;
  certificates: string;
  present: string;
  thesis: string;
};

export type CvPdfData = {
  work: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certificates: Certificate[];
  locale: string;
  labels: CvPdfLabels;
};

const colors = {
  paper: "#f7f1e8",
  text: "#1b1611",
  muted: "#716455",
  line: "#d2c0aa",
  accent: "#216653",
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.paper,
    color: colors.text,
    fontFamily: "Noto Sans",
    fontSize: 8.35,
    lineHeight: 1.35,
    paddingTop: 44,
    paddingRight: 51,
    paddingBottom: 62,
    paddingLeft: 51,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 19 },
  identity: { width: "62%" },
  name: { fontSize: 23, lineHeight: 1.15, fontFamily: "Noto Sans", fontWeight: 700, letterSpacing: -0.65 },
  role: { marginTop: 7, color: colors.accent, fontSize: 10.5, lineHeight: 1.2, fontFamily: "Noto Sans", fontWeight: 700 },
  contact: { width: "35%", alignItems: "flex-end", color: colors.muted, fontSize: 7.1, lineHeight: 1.48 },
  contactItem: { textAlign: "right", marginBottom: 1 },
  link: { color: colors.muted, textDecoration: "none" },
  section: { marginBottom: 13 },
  sectionLabel: { color: colors.accent, fontFamily: "Noto Sans Mono", fontWeight: 700, fontSize: 8, marginBottom: 6 },
  entry: { flexDirection: "row", borderTopWidth: 0.5, borderTopColor: colors.line, paddingTop: 6, marginBottom: 6 },
  entryMeta: { width: "22%", paddingRight: 10, color: colors.muted, fontFamily: "Noto Sans Mono", fontSize: 6.9 },
  entryContent: { width: "78%" },
  entryTitle: { fontFamily: "Noto Sans", fontWeight: 700, fontSize: 9.5 },
  entrySubtitle: { color: colors.muted, marginTop: 1, marginBottom: 2.5 },
  bodyLine: { color: colors.muted, marginBottom: 2 },
  bulletRow: { flexDirection: "row", marginBottom: 1.6 },
  bullet: { width: 8, color: colors.accent },
  bulletText: { flex: 1, color: colors.muted },
  bulletTextStrong: { color: colors.text, fontFamily: "Noto Sans", fontWeight: 700 },
  tech: { marginTop: 2.5, color: colors.accent, fontFamily: "Noto Sans Mono", fontSize: 6.8, lineHeight: 1.35 },
  compactGrid: { flexDirection: "row", flexWrap: "wrap", borderTopWidth: 0.5, borderTopColor: colors.line },
  compactRow: { width: "50%", paddingTop: 5.5, paddingRight: 12, paddingBottom: 5.5, borderBottomWidth: 0.5, borderBottomColor: colors.line },
  compactRowEven: { paddingRight: 0, paddingLeft: 12, borderLeftWidth: 0.5, borderLeftColor: colors.line },
  compactLabel: { fontFamily: "Noto Sans", fontWeight: 700, marginBottom: 2 },
  compactValue: { color: colors.muted },
  certificateName: { fontFamily: "Noto Sans", fontWeight: 700, marginBottom: 1.5 },
  certificateMeta: { flexDirection: "row", justifyContent: "space-between" },
  certificateIssuer: { color: colors.muted },
  certificateLink: { color: colors.accent, textDecoration: "none", fontFamily: "Noto Sans Mono", fontSize: 6.8 },
  footer: { position: "absolute", right: 51, bottom: 24, left: 51, flexDirection: "row", justifyContent: "space-between", color: colors.muted, fontFamily: "Noto Sans Mono", fontSize: 6.5 },
});

function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel} minPresenceAhead={36}>{`// ${children.toLowerCase()}`}</Text>;
}

export function CvPdfDocument({ work, education, skills, certificates, locale, labels }: CvPdfData) {
  const contactItems = [
    { label: profile.location },
    { label: profile.email, href: `mailto:${profile.email}` },
    { label: profile.github, href: profile.githubUrl },
    { label: profile.linkedin, href: profile.linkedinUrl },
    { label: profile.website, href: profile.websiteUrl },
  ];

  return (
    <Document
      title={`${profile.name} – Curriculum Vitae`}
      author={profile.name}
      subject="Curriculum Vitae"
      creator={profile.website}
      language={locale.startsWith("kk") ? "kk" : "en"}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <View style={styles.identity}>
            <Text style={styles.name}>{profile.name.toUpperCase()}</Text>
            <Text style={styles.role}>{labels.title}</Text>
          </View>
          <View style={styles.contact}>
            {contactItems.map((item) => (
              <Text key={item.label} style={styles.contactItem}>
                {item.href ? <Link src={item.href} style={styles.link}>{item.label}</Link> : item.label}
              </Text>
            ))}
          </View>
        </View>

        {work.length > 0 && (
          <View style={styles.section}>
            <SectionLabel>{labels.experience}</SectionLabel>
            {work.map((item, index) => (
              <View key={item.id ?? `${item.company}-${index}`} style={styles.entry} minPresenceAhead={58}>
                <View style={styles.entryMeta}>
                  <Text>{formatRange(item.startDate, item.endDate, locale, labels.present)}</Text>
                  {item.location && <Text>{item.location}</Text>}
                </View>
                <View style={styles.entryContent}>
                  <Text style={styles.entryTitle}>{item.position}</Text>
                  <Text style={styles.entrySubtitle}>{item.company}</Text>
                  {parsePdfDescription(item.description).map((line, lineIndex) => line.isBullet ? (
                    <View key={`${line.value}-${lineIndex}`} style={[styles.bulletRow, { marginLeft: line.level * 10 }]}>
                      <Text style={styles.bullet}>{pdfBulletForLevel(line.level)}</Text>
                      <Text style={[styles.bulletText, ...(line.isStrong ? [styles.bulletTextStrong] : [])]}>{line.value}</Text>
                    </View>
                  ) : <Text key={`${line.value}-${lineIndex}`} style={styles.bodyLine}>{line.value}</Text>)}
                  {item.techStack && <Text style={styles.tech}>{item.techStack}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <SectionLabel>{labels.education}</SectionLabel>
            {education.map((item, index) => (
              <View key={item.id ?? `${item.institution}-${index}`} style={styles.entry} minPresenceAhead={52}>
                <View style={styles.entryMeta}>
                  <Text>{formatRange(item.startDate, item.endDate, locale, labels.present)}</Text>
                  {item.location && <Text>{item.location}</Text>}
                </View>
                <View style={styles.entryContent}>
                  <Text style={styles.entryTitle}>{item.degree}</Text>
                  <Text style={styles.entrySubtitle}>{item.institution}</Text>
                  {item.thesis && <Text style={styles.bodyLine}>{labels.thesis}: {item.thesis}</Text>}
                  {parsePdfDescription(item.description).map((line, lineIndex) => line.isBullet ? (
                    <View key={`${line.value}-${lineIndex}`} style={[styles.bulletRow, { marginLeft: line.level * 10 }]}>
                      <Text style={styles.bullet}>{pdfBulletForLevel(line.level)}</Text>
                      <Text style={[styles.bulletText, ...(line.isStrong ? [styles.bulletTextStrong] : [])]}>{line.value}</Text>
                    </View>
                  ) : <Text key={`${line.value}-${lineIndex}`} style={styles.bodyLine}>{line.value}</Text>)}
                </View>
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <SectionLabel>{labels.skills}</SectionLabel>
            <View style={styles.compactGrid}>
            {skills.map((item, index) => (
              <View key={item.id ?? `${item.category}-${index}`} style={[styles.compactRow, ...(index % 2 ? [styles.compactRowEven] : [])]} wrap={false}>
                <Text style={styles.compactLabel}>{item.category}</Text>
                <Text style={styles.compactValue}>{item.skillNames?.trim()}</Text>
              </View>
            ))}
            </View>
          </View>
        )}

        {certificates.length > 0 && (
          <View style={styles.section}>
            <SectionLabel>{labels.certificates}</SectionLabel>
            <View style={styles.compactGrid}>
            {certificates.map((item, index) => (
              <View key={item.id ?? `${item.name}-${index}`} style={[styles.compactRow, ...(index % 2 ? [styles.compactRowEven] : [])]} wrap={false}>
                <Text style={styles.certificateName}>{item.name}</Text>
                <View style={styles.certificateMeta}>
                  <Text style={styles.certificateIssuer}>{item.issuer}</Text>
                  {item.url && <Link src={item.url} style={styles.certificateLink}>VIEW ↗</Link>}
                </View>
              </View>
            ))}
            </View>
          </View>
        )}

        <View fixed style={styles.footer}>
          <Text>{profile.name} · CV · {profile.website}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}

// This module is loaded on demand; keeping generation beside the document avoids eager renderer loading.
// eslint-disable-next-line react-refresh/only-export-components
export async function downloadCvPdf(data: CvPdfData) {
  const blob = await pdf(<CvPdfDocument {...data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = CV_PDF_FILENAME;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
