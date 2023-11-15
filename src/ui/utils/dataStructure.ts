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
          // {
          //   title: "Abstract1",
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
        title: "Gothic",
        subgroups: [
          {
            title: "Decor",
            imageActive: groupsUtil.imageActive1,
            imagePassive: groupsUtil.imagePassive1,
          },
          // {
          //   title: "Decor1",
          //   imageActive: groupsUtil.imageActive2,
          //   imagePassive: groupsUtil.imagePassive2,
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
      // {
      //   title: "Minimal",
      //   subgroups: [
      //     // {
      //     //   title: "Abstract",
      //     //   imageActive: groupsUtil.imageActive1,
      //     //   imagePassive: groupsUtil.imagePassive1,
      //     // },
      //     // {
      //     //   title: "Abstract2",
      //     //   imageActive: groupsUtil.imageActive2,
      //     //   imagePassive: groupsUtil.imagePassive2,
      //     // },
      //     // {
      //     //   title: "Abstract3",
      //     //   imageActive: groupsUtil.imageActive3,
      //     //   imagePassive: groupsUtil.imagePassive3,
      //     // },
      //     // {
      //     //   title: "Abstract4",
      //     //   imageActive: groupsUtil.imageActive4,
      //     //   imagePassive: groupsUtil.imagePassive4,
      //     // },
      //     // {
      //     //   title: "Abstract5",
      //     //   imageActive: groupsUtil.imageActive5,
      //     //   imagePassive: groupsUtil.imagePassive5,
      //     // },
          
      //     // ... другие подгруппы для Simple
      //   ],
      // },
      // ... другие группы для Frames
    ],
  },
  {
    name: "Textures",
    groups: [
      {
        title: "Big",
        subgroups: [
          {
            title: "Color",
            imageActive: groupsUtil.imageActive1,
            imagePassive: groupsUtil.imagePassive1,
          }
        ]
      },
      {
        title: "Medium",
        subgroups: [
          {
            title: "Color",
            imageActive: groupsUtil.imageActive2,
            imagePassive: groupsUtil.imagePassive2,
          }
        ]
      },
      {
        title: "Small",
        subgroups: [
          {
            title: "Color",
            imageActive: groupsUtil.imageActive3,
            imagePassive: groupsUtil.imagePassive3,
          }
        ]
      }
    ], // Здесь можно добавить группы для Textures
  },
  {
    name: "Details",
    groups: [
      {
        title: "Elements",
        subgroups: [
          {
            title: "Diamonds",
            imageActive: groupsUtil.imageActive1,
            imagePassive: groupsUtil.imagePassive1
          },
          {
            title: "Pedestal",
            imageActive: groupsUtil.imageActive2,
            imagePassive: groupsUtil.imagePassive2
          },
          {
            title: "Water",
            imageActive: groupsUtil.imageActive3,
            imagePassive: groupsUtil.imagePassive3
          },
          {
            title: "Diamonds",
            imageActive: groupsUtil.imageActive1,
            imagePassive: groupsUtil.imagePassive1
          },
          {
            title: "Pedestal",
            imageActive: groupsUtil.imageActive2,
            imagePassive: groupsUtil.imagePassive2
          },
          {
            title: "Water",
            imageActive: groupsUtil.imageActive3,
            imagePassive: groupsUtil.imagePassive3
          },
        ]
      },
      
      {
        title: "Plants",
        subgroups: [
          {
            title: "Flowers",
            imageActive: groupsUtil.imageActive1,
            imagePassive: groupsUtil.imagePassive1
          },
          {
            title: "Green",
            imageActive: groupsUtil.imageActive2,
            imagePassive: groupsUtil.imagePassive2
          },
          {
            title: "Pinkleaves",
            imageActive: groupsUtil.imageActive3,
            imagePassive: groupsUtil.imagePassive3
          },
        ]
      },
      {
        title: "Shapes",
        subgroups: [
          {
            title: "Glass",
            imageActive: groupsUtil.imageActive1,
            imagePassive: groupsUtil.imagePassive1
          },
        ]
      },
    ], // Здесь можно добавить группы для Details
  },
  {
    name: "Effects",
    groups: [
      {
        title: "Effects",
        subgroups: [
          {
            title: "Effects1",
            imageActive: groupsUtil.imageActive1,
            imagePassive: groupsUtil.imagePassive1
          },
          {
            title: "Effects2",
            imageActive: groupsUtil.imageActive2,
            imagePassive: groupsUtil.imagePassive2
          },
          {
            title: "Effects3",
            imageActive: groupsUtil.imageActive3,
            imagePassive: groupsUtil.imagePassive3
          },
        ]
      },
    ], // Здесь можно добавить группы для Effects
  },
];
