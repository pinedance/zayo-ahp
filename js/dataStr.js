{
  task: {
    myGoal : "점심에 뭘 먹을까?",
    myCriterias : "맛,값,거리",
    myAlternatives : "짜장면,국밥,돈까스,백반"
  },
  comparing: {
    criterias: {
      lists: ["맛", "값", "거리"],
      pairwise: [
        {
          pair: ["맛", "값"],
          moreImpFact: "맛",
          lessImpFact: "값",
          intensity: 7,
        },
        {
          pair: ["맛", "거리"],
          moreImpFact: "맛",
          lessImpFact: "거리",
          intensity: 5,
        },
        {
          pair: ["값", "거리"],
          moreImpFact: "값",
          lessImpFact: "거리",
          intensity: 3,
        }
      ]
    },
    alternatives : {
      lists : ["짜장면", "국밥", "돈까스", "백반"],
      local: [
        {
          cri : "맛",
          pairwise: [
            {
              pair: ["짜장면", "국밥"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair: ["짜장면", "돈까스"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair: ["짜장면", "백반"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair:  ["국밥", "돈까스"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair:  ["국밥", "백반"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair:  ["돈까스", "백반"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            }
          ]
        },
        {
          cri : "값",
          pairwise: [
            {
              pair: ["짜장면", "국밥"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair: ["짜장면", "돈까스"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair: ["짜장면", "백반"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair:  ["국밥", "돈까스"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair:  ["국밥", "백반"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair:  ["돈까스", "백반"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            }
          ]
        },
        {
          cri : "맛",
          pairwise: [
            {
              pair: ["짜장면", "국밥"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair: ["짜장면", "돈까스"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair: ["짜장면", "백반"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair:  ["국밥", "돈까스"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair:  ["국밥", "백반"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            },
            {
              pair:  ["돈까스", "백반"],
              moreImpFact: "",
              lessImpFact: "",
              intensity: 1,
            }
          ]
        },
      ]
    }
  },
  {
    judgement: [
      
    ]
  }


}
