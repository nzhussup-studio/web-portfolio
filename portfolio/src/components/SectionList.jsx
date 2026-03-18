import React from "react";
import SectionTitle from "./SectionTitle";

const SectionList = ({
  id,
  title,
  data,
  renderItem,
  isDarkMode,
  emptyMessage,
  t,
  icon,
}) => (
  <section id={id}>
    <SectionTitle icon={icon} title={title} isDarkMode={isDarkMode} t={t} />

    {Array.isArray(data) && data.length > 0 ? (
      data.map((item, index) => renderItem(item, index, isDarkMode))
    ) : (
      <p>{emptyMessage}</p>
    )}
  </section>
);

export default SectionList;
