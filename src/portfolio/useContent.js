import { useEffect, useState } from 'react';
import { experience as staticExperience, projects as staticProjects, skills as staticSkills } from './data';
import { moments as staticMoments } from './moments';

export function useContent() {
  const [content, setContent] = useState({
    projects: staticProjects,
    experience: staticExperience,
    skills: staticSkills,
    moments: staticMoments,
  });

  useEffect(() => {
    let active = true;
    fetch('/api/content')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setContent({
          projects: Array.isArray(data.projects) ? data.projects : staticProjects,
          experience: Array.isArray(data.experience) ? data.experience : staticExperience,
          skills: Array.isArray(data.skills) ? data.skills : staticSkills,
          moments: Array.isArray(data.moments) ? data.moments : staticMoments,
        });
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return content;
}