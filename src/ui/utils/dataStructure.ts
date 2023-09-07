import  groupsUtil  from './groups.util';

export interface Subgroup {
  title: string;
  imageActive: string;
  imagePassive: string;
}

export interface Group {
  title: string;
  subgroups: Subgroup[];
}

export interface Tab {
  name: string;
  groups: Group[];
}

export const tabsData: Tab[] = [
  {
    name: "Frames",
    groups: [
      {
        title: "Simple",
        subgroups: [
          {
            title: "Abstract",
            imageActive: groupsUtil.imageActive1,
            imagePassive: groupsUtil.imagePassive1,
          },
          {
            title: "Abstract1",
            imageActive: groupsUtil.imageActive2,
            imagePassive: groupsUtil.imagePassive2,
          },
          // {
          //   title: "Abstract3",
          //   imageActive: groupsUtil.imageActive3,
          //   imagePassive: groupsUtil.imagePassive3,
          // },
          // {
          //   title: "Abstract4",
          //   imageActive: groupsUtil.imageActive4,
          //   imagePassive: groupsUtil.imagePassive4,
          // },
          // {
          //   title: "Abstract5",
          //   imageActive: groupsUtil.imageActive5,
          //   imagePassive: groupsUtil.imagePassive5,
          // },
          
          // ... другие подгруппы для Simple
        ],
      },
      {
        title: "Gothic",
        subgroups: [
          {
            title: "Decor",
            imageActive: groupsUtil.imageActive1,
            imagePassive: groupsUtil.imagePassive1,
          },
          {
            title: "Decor1",
            imageActive: groupsUtil.imageActive2,
            imagePassive: groupsUtil.imagePassive2,
          },
          // {
          //   title: "Abstract2",
          //   imageActive: groupsUtil.imageActive2,
          //   imagePassive: groupsUtil.imagePassive2,
          // },
          // {
          //   title: "Abstract3",
          //   imageActive: groupsUtil.imageActive3,
          //   imagePassive: groupsUtil.imagePassive3,
          // },
          // {
          //   title: "Abstract4",
          //   imageActive: groupsUtil.imageActive4,
          //   imagePassive: groupsUtil.imagePassive4,
          // },
          // {
          //   title: "Abstract5",
          //   imageActive: groupsUtil.imageActive5,
          //   imagePassive: groupsUtil.imagePassive5,
          // },
          
          // ... другие подгруппы для Simple
        ],
      },
      {
        title: "Minimal",
        subgroups: [
          // {
          //   title: "Abstract",
          //   imageActive: groupsUtil.imageActive1,
          //   imagePassive: groupsUtil.imagePassive1,
          // },
          // {
          //   title: "Abstract2",
          //   imageActive: groupsUtil.imageActive2,
          //   imagePassive: groupsUtil.imagePassive2,
          // },
          // {
          //   title: "Abstract3",
          //   imageActive: groupsUtil.imageActive3,
          //   imagePassive: groupsUtil.imagePassive3,
          // },
          // {
          //   title: "Abstract4",
          //   imageActive: groupsUtil.imageActive4,
          //   imagePassive: groupsUtil.imagePassive4,
          // },
          // {
          //   title: "Abstract5",
          //   imageActive: groupsUtil.imageActive5,
          //   imagePassive: groupsUtil.imagePassive5,
          // },
          
          // ... другие подгруппы для Simple
        ],
      },
      // ... другие группы для Frames
    ],
  },
  {
    name: "Textures",
    groups: [], // Здесь можно добавить группы для Textures
  },
  {
    name: "Details",
    groups: [], // Здесь можно добавить группы для Details
  },
  {
    name: "Effects",
    groups: [], // Здесь можно добавить группы для Effects
  },
];
