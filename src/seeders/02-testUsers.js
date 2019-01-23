import uuidv4 from 'uuid/v4';
import { cryptData } from '../utilities';

const init = async () => {
  const password = await cryptData.encryptData('password');
  return password;
};

export default {
  up: async queryInterface => queryInterface.bulkInsert('Users', [{
    id: 'dccd8ee7-bc98-4a8e-a832-ca116c5fff0a',
    firstName: 'Adepoju',
    lastName: 'Oluwasegun',
    email: 'oluwasegun.adepoju@andela.com',
    roleId: 1,
    password: await init(),
    username: 'shegsteham',
    image: 'https://placeimg.com/640/480/people',
    emailNotification: true,
    inAppNotification: true,
    isVerified: true,
    bio: `Solutions-driven Programmer/Analyst with commended performance,
     versed in software development, with a strong working knowledge of 
     algorithms and data structures. Experienced in the Use of various 
     Software Platforms and capable of taking-on any technology within days.`,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'c667aa9b-e5a1-4552-960b-8cc2a9c09ccb',
    firstName: 'Chinemelu',
    lastName: 'Nwosu',
    email: 'anthony.nwosu@andela.com',
    roleId: 1,
    password: await init(),
    bio: `Finds and report articlAchievers refers to the overall process
     of attracting, selecting and appointing suitable candidates for jobs
      (either permanent or temporary) within an organization. Recruitment
       can also refer to processes involved in choosing individuals for 
       unpaid positions, such as voluntary roles or unpaid trainee roles.
        Managers, human resource generalists and recruitment specialists may
       be tasked with carrying out recruitment, but in some cases public-sector
       employment agencies, commercial recruitment agencies, or specialist 
       search consultancies are used to undertake parts of the process. 
       Internet-based technologies to support all aspects of recruitment 
       have become widespread.`,
    username: 'Tony',
    image: 'https://placeimg.com/640/480/people',
    isVerified: true,
    emailNotification: false,
    inAppNotification: false,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  },
  {
    id: 'e7eaef9b-c3d9-40fa-89e1-26eae190f1aa',
    firstName: 'Andrew',
    lastName: 'Odinakachukwu',
    email: 'andrew.okoye@andela.com',
    roleId: 1,
    password: await init(),
    bio: `I am Andrew in Soul. Experienced Doctor with
     a demonstrated history of working in the hospital 
     & health care industry. Skilled in Veterinary Medicine,
      Biotechnology, Analytical Skills, Pharmacodynamics, and
       Communication. Strong healthcare services professional 
       with a Master of Science`,
    username: 'andrewinsoul',
    image: 'https://placeimg.com/640/480/people',
    emailNotification: false,
    inAppNotification: false,
    isVerified: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'cccd8ee7-bc98-4a8e-a832-ca116d6fff0b',
    email: 'jahmed.omosanya@andela.com',
    firstName: 'Ahmed',
    lastName: 'Omosanya',
    bio: `Experienced Support with a demonstrated history of working in
     the information technology and services industry. Skilled in Network
      Administration (Cisco based), Both Windows and Linux software support,
       POS hardware/software support, and much more...`,
    roleId: 1,
    username: 'ahmed',
    image: 'https://placeimg.com/640/480/people',
    password: await init(),
    isVerified: true,
    emailNotification: true,
    inAppNotification: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '4157aa5d-d145-4f5e-8bc0-58000333bb2c',
    firstName: 'Jide',
    lastName: 'Ajayi',
    email: 'babajide.ajayi@andela.com',
    roleId: 1,
    password: await init(),
    bio: `Complex problem solving Superior time management Accurate forecasting
     Superior research skills Self-motivated professional MS Office Suite 
     Variance analysis STATA`,
    username: 'jide',
    image: 'https://placeimg.com/640/480/people',
    isVerified: true,
    emailNotification: true,
    inAppNotification: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '781063b9-92be-4d9a-8699-fdac9227f32c',
    firstName: 'Chiagoziem',
    lastName: 'Young',
    email: 'chiagoziem.nwadike@andela.com',
    roleId: 1,
    password: await init(),
    bio: `Ambitious, resilient & proactive at learning new things.. I'm 
    ready to take up a new challenge that will impact lives of people and
     make me grow as a person`,
    username: 'nwashangai',
    image: 'https://placeimg.com/640/480/people',
    isVerified: true,
    emailNotification: true,
    inAppNotification: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '9ca2980c-20cf-48c0-9c5d-a2398018524c',
    firstName: 'Ademola',
    lastName: 'Hussain',
    email: 'ademola.hussain@andela.com',
    roleId: 1,
    password: await init(),
    bio: `I am working as Senior Officer, Commercial Operation-Supply Chain,
     Import (Foreign Trade) at Partex Star Group. I have sound knowledge on 
     UCP 600, eUCP, ISBP 745, URR725, ISP98, Incoterms 2010 and Anti Money 
     Laundering etc.`,
    username: 'IceCream',
    image: 'https://placeimg.com/640/480/people',
    isVerified: true,
    emailNotification: true,
    inAppNotification: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: 'c08a03ae-e9c4-4ce6-83a3-cfc5756c05d9',
    firstName: 'John',
    lastName: 'Doe',
    email: 'yomizy@wizzy.com',
    roleId: 1,
    password: await init(),
    username: 'licecream',
    image: 'https://placeimg.com/640/480/people',
    emailNotification: true,
    inAppNotification: true,
    isVerified: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    firstName: 'Tony',
    lastName: 'Nwosu',
    email: 'tonyboy@andela.com',
    roleId: 1,
    password: await init(),
    bio: 'Finds and report articles',
    username: 'Tonyboy',
    image: 'https://placeimg.com/640/480/people',
    isVerified: true,
    emailNotification: false,
    inAppNotification: false,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    username: 'JaneDoeReporter',
    password: await init(),
    email: 'janedoereporter@wemail.com',
    firstName: 'JaneReporter',
    lastName: 'DoeReporter',
    image: 'https://placeimg.com/640/480/people',
    bio: 'Finds and report articles',
    roleId: 1,
    isVerified: true,
    emailNotification: true,
    inAppNotification: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: uuidv4(),
    firstName: 'Tony',
    lastName: 'Nwosu',
    email: 'mike@myzone.com',
    roleId: 1,
    password: await init(),
    bio: 'Finds and report articles',
    username: 'mike',
    image: 'https://placeimg.com/640/480/people',
    isVerified: true,
    emailNotification: false,
    inAppNotification: false,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }, {
    id: '315cdb56-fad1-4712-81c8-d82ccdbc8b5a',
    firstName: 'Jide',
    lastName: 'Ajayi',
    email: 'jide@ajayi.com',
    roleId: 2,
    password: await init(),
    bio: 'Finds and report articles',
    username: 'jideajayi',
    image: 'https://placeimg.com/640/480/people',
    isVerified: true,
    emailNotification: true,
    inAppNotification: true,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }], {}),
  down: queryInterface => queryInterface.bulkDelete('Users', null, {})
};
