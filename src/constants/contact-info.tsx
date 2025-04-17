import { SiGithub, SiLinkedin } from 'react-icons/si';

export const CONTACT_INFO = {
  name: 'Gustavo Domingueti',
  phone: '+55 (11) 9 7158-1380',
  email: 'gustavo.s.domingueti@icloud.com',
  location: 'São Paulo, SP - Brazil',
  social: [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/gustavo-domingueti',
      icon: <SiLinkedin />,
    },
    {
      name: 'GitHub',
      url: 'https://github.com/dominguetigs',
      icon: <SiGithub />,
    },
  ],
};
