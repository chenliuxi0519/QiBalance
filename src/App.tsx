import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'motion/react';
import {
  Heart,
  ShieldCheck,
  TrendingUp,
  Camera,
  Droplets,
  Moon,
  ArrowRight,
  CheckCircle2,
  Wallet,
  Coins,
  DollarSign,
  Trophy,
  Zap,
  ThumbsUp,
  Users,
  Award,
  ChevronDown,
  Leaf,
  Sparkles,
  Info,
  Languages,
  Activity,
  Utensils,
  MapPin,
  RefreshCw,
  RotateCcw,
  X,
  Mail,
  Crown,
  Brain,
  ShoppingBag,
  HeartPulse,
  Lock,
  LogOut,
  Calendar
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  saveLead,
  signIn,
  signOut,
  onAuthStateChanged,
  subscribeToLeads,
  auth,
  type User,
  type Lead
} from './firebase';

import oneCN from './assets/1CN.mp4';
import testCN from './assets/TestCN.mov';
import preferCN from './assets/PreferCN.mov';
import planCN from './assets/PlanCN.mov';
import checkCN from './assets/CheckCN.mov';
import aiCN from './assets/AICN.mov';

import oneEN from './assets/1EN.mp4';
import testEN from './assets/TestEN.mov';
import preferEN from './assets/PreferEN.mov';
import planEN from './assets/PlanEN.mov';
import checkEN from './assets/CheckEN.mov';
import aiEN from './assets/AIEN.mov';


function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



const appVideos: Record<Language, { hero: string; steps: string[] }> = {
  zh: {
    hero: oneCN,
    steps: [testCN, preferCN, planCN, checkCN, aiCN]
  },
  en: {
    hero: oneEN,
    steps: [testEN, preferEN, planEN, checkEN, aiEN]
  }
};

type Language = 'en' | 'zh';

const translations = {
  en: {
    nav: {
      howItWorks: "How it Works",
      betting: "Wellness Betting",
      faq: "FAQ",
      startTrial: "Free Trial"
    },
    waitlistModal: {
      title: "Join the Waitlist",
      subtitle: "Be the first to know when the official challenge opens.",
      contactPlaceholder: "Email or Phone Number",
      button: "Join Waitlist",
      success: "You're on the list!",
      incentiveTitle: "Early Adopter Benefits:",
      incentives: [
        "Extra reward bonus boost",
        "Priority access to official challenges"
      ],
      trust: "You're joining the waitlist for early access to the challenge"
    },
    features: {
      title: "Core Capabilities",
      subtitle: "Ancient Wisdom for the Modern Gut.",
      items: [
        {
          id: "understandBody",
          badge: "Understand Your Body",
          title: "TCM-inspired, but designed for everyday use",
          summary: "Identify your constitution and root causes of digestive discomfort.",
          desc: "Based on the classical TCM “Ten Questions” framework, we translate traditional diagnostic logic into simple, intuitive interactions. The system evaluates key dimensions such as Yin-Yang balance, digestive (spleen–stomach) function, and Qi dynamics, offering meaningful insights while keeping the experience lightweight and accessible for busy office workers."
        },
        {
          id: "fitPreferences",
          badge: "Fit Your Preferences",
          title: "Personalized, not restrictive",
          summary: "Sustain gut-friendly eating habits without sacrificing taste.",
          desc: "We combine TCM principles with your personal food preferences and office lifestyle to create plans that fit your taste. Making healthy eating easier, more enjoyable, and sustainable. Let gut health no longer be a burden, but a daily habit that can be easily maintained."
        },
        {
          id: "followPlan",
          badge: "Follow a Clear Plan",
          title: "Less thinking. More healing",
          summary: "14-day phased plans with nearby dining recommendations.",
          desc: "Based on your constitution, symptoms, and real-time location, we generate a structured 2-week TCM-based meal plan. Each meal comes with clear guidance and multiple options—including nearby dining choices that align with your plan—so you don't have to struggle with 'what to eat' during a busy workday."
        },
        {
          id: "trackEffort",
          badge: "Track Without Effort",
          title: "Progress over perfection",
          summary: "Meal logging and simple feedback to reduce recurring issues.",
          desc: "After each meal, upload a photo to quickly log what you've eaten. Using image recognition, the system analyzes your meal and compares it with your plan. Through simple check-in feedback, the platform helps you continuously adjust your eating patterns and gradually build sustainable healthy habits."
        },
        {
          id: "adaptRealTime",
          badge: "Adapt in Real Time",
          title: "Dynamic AI Adjustment",
          summary: "Adjust plan based on lifestyle habits and daily state.",
          desc: "According to your state of the day and lifestyle changes, the plan is dynamically adjusted. Through conversation with the AI assistant, you can optimize your health plan anytime, anywhere, ensuring it fits the reality of office life."
        }
      ]
    },
    hero: {
      badge: "Free if you're disciplined",
      title: "Turn “what you should eat” into “what you can eat right now.”",
      subtitle: "AI TCM Analysis + Nearby Recommendations. Helping you turn healthy eating into actionable choices.",
      ctaPrimary: "Free Trial",
      ctaSecondary: "See today's plan",
      ctaIncentive: "— Early access users can earn more rewards in the first month",
      users: "professionals committed this month"
    },
    pain: {
      title: "It's not that you don't want to be healthy, it's just hard to stick to it.",
      items: [
        {
          title: "I know but can't do",
          desc: "I know what's healthy, but the complexity of TCM and my busy work life make execution feel impossible for me."
        },
        {
          title: "My takeout is uncontrollable",
          desc: "My office lunches are a gamble. I can't find meals that fit my constitution nearby."
        },
        {
          title: "I feel anxious after eating",
          desc: "I feel bloated and uncomfortable after every meal, leading to my constant worry about my digestive health."
        }
      ],
      summary: "Join now to stay consistent! Not only can you get your commitment fee back, but you can also share the rewards from those who didn't stick to it! Let's cheer each other on!"
    },
    betting: {
      title: "This is not a willpower-based health app",
      subtitle: "Stay consistent, get your money back. You're not paying—you're committing to yourself.",
      summary: "Commitment: 9.9 SGD/month — You're not paying, you're committing to yourself",
      steps: [
        {
          title: "Deposit Commitment",
          desc: "Start with a monthly commitment fee of 9.9 SGD. This is your skin in the game."
        },
        {
          title: "Daily Discipline",
          desc: "Follow the recommended diet and log your meals daily. Data-backed proof of your progress."
        },
        {
          title: "Full Refund + Rewards",
          desc: "Summary every 14 days: success days are calculated. If you don't withdraw at day 14, continue to day 28 for total success calculation and 100% refund + bonus."
        }
      ],
      milestones: [
        { days: "7 Days", reward: "30% Cashback", desc: "Initial habit formation" },
        { days: "14 Days", reward: "50% Cashback", desc: "Building consistency" },
        { days: "21 Days", reward: "70% Cashback", desc: "Deepening the habit" },
        { days: "28 Days", reward: "100% Cashback", desc: "Total transformation" }
      ],
      whyTitle: "Consistency Pays Off",
      whyDesc: "Don't lose, just gain. Your persistence is your best investment.",
      completionRate: "Completion Rate",
      avgReward: "Avg. Monthly Reward"
    },
    howItWorks: {
      title: "How it Works",
      steps: [
        {
          title: "TCM-inspired, \nbut designed for everyday use",
          badge: "Understand Your Body",
          summary: "",
          desc: "Based on the classical TCM “Ten Questions” framework, we translate traditional diagnostic logic into simple, intuitive interactions. Quickly understand your body state—from Yin-Yang balance to Qi flow—through everyday sensations, with no medical knowledge required."
        },
        {
          title: "Personalized, not restrictive",
          badge: "Fit Your Preferences",
          summary: "",
          desc: "We combine TCM principles with your personal food preferences to create plans that fit your taste. Making healthy eating easier, more enjoyable, and sustainable, so it becomes a daily habit rather than a burden."
        },
        {
          title: "Less thinking. \nMore healing",
          badge: "Follow a Clear Plan",
          summary: "",
          desc: "Based on your body constitution and preferences, we generate a structured 14-day TCM-based meal plan. Each meal comes with clear guidance and multiple options, so you never have to worry about what to eat."
        },
        {
          title: "Progress over perfection",
          badge: "Track Without Effort",
          summary: "",
          desc: "Simply upload a photo of your meal. Our AI analyzes ingredients and food properties to see how well they align with your wellness goals, allowing for informed adjustments instead of an all-or-nothing approach."
        },
        {
          title: "Adapt in Real Time",
          badge: "Dynamic AI Adjustment",
          summary: "",
          desc: "Your plan dynamically adjusts based on your daily state and lifestyle changes. Through conversation with the AI assistant, you can optimize your health plan anytime to fit the reality of your busy life."
        }
      ],
      conclusion: "Consistency → Cashback → Habit Formation",
      knowledgeBase: "Knowledge Base"
    },
    faq: {
      title: "Frequently Asked Questions",
      questions: [
        {
          q: "I often eat out for work. Can I still follow the plan?",
          a: "Absolutely. 炁 Qì analyzes your real-time location to recommend nearby dining options—from office building cafeterias to local restaurants—that align with your TCM constitution and phased dietary plan. We make it easy to stay on track even with a busy social or work schedule."
        },
        {
          q: "How does the AI analyze my digestive health?",
          a: "By combining your constitution analysis (via the 'Ten Questions' and tongue analysis) with your reported symptoms and lifestyle habits, our AI identifies patterns of imbalance. It then generates a phased plan to gradually reduce recurring discomfort and strengthen your digestive system."
        },
        {
          q: "Is my commitment fee really refunded?",
          a: "Yes. If you complete your daily tasks (meal logging and simple check-in feedback) for the duration of the cycle, your entire commitment fee is returned. We use behavioral economics to help you overcome the struggle of sustaining new habits."
        },
        {
          q: "What if I can't follow the meal plan perfectly?",
          a: "Progress over perfection. Our image recognition analyzes your actual meals and provides feedback on how well they align with your goals. The goal is to help you continuously adjust your patterns, not to force a restrictive diet."
        }
      ]
    },
    footer: {
      desc: "Ancient wisdom for modern discipline. We're on a mission to make TCM balance accessible, consistent, and rewarding for everyone.",
      contact: "Contact Us: E1576500@u.nus.edu",
      rights: "© 2026 炁 Qì Balance. All rights reserved."
    },
    cta: {
      title: "Ready to commit to your health?",
      subtitle: "Join 99+ users who are turning their discipline into dividends. Start your 7-day free trial today.",
      missionTitle: "🌱 Mission (What we do)",
      missionDesc: "Make personalized healing through daily eating simple and actionable.",
      visionTitle: "Vision (What we want to change)",
      visionDesc: "A world where people understand their bodies and eat in harmony with them.",
      button: "Free Trial",
      incentiveTitle: "First 500 users will get:",
      incentives: [
        "Extra reward bonus boost",
        "Priority access to official challenges"
      ],
      waitlist: "You're joining the waitlist for early access to the challenge",
      secure: "Secure Payments",
      community: "Community Driven"
    }
  },
  zh: {
    nav: {
      howItWorks: "运作机制",
      betting: "健康对赌",
      faq: "常见问题",
      startTrial: "免费试用"
    },
    waitlistModal: {
      title: "加入内测预约",
      subtitle: "正式挑战即将开放，第一时间获取通知。",
      contactPlaceholder: "邮箱或手机号码",
      button: "立即预约",
      success: "预约成功！",
      incentiveTitle: "预约用户专属福利：",
      incentives: [
        "额外奖励加成",
        "优先参与正式挑战资格"
      ],
      trust: "当前为内测预约 · 正式挑战即将开放"
    },
    features: {
      title: "核心功能",
      subtitle: "古老智慧，调理现代肠胃。",
      items: [
        {
          id: "understandBody",
          badge: "体质测评",
          title: "TCM-inspired, but designed for everyday use",
          summary: "基于中医“十问”，识别您的体质与肠胃不适根源",
          desc: "基于中医经典“十问”体系，我们将传统辨证逻辑转化为简洁直观的交互问题。该方法围绕阴阳平衡、脾胃功能与气机状态等核心维度，在降低使用门槛的同时，为忙碌的职场人士提供具有高度参考价值的判断。"
        },
        {
          id: "fitPreferences",
          badge: "饮食偏好",
          title: "Personalized, not restrictive",
          summary: "不强迫改变，在不牺牲口味的前提下坚持护肠胃习惯",
          desc: "我们不仅基于中医理论进行调理，还会结合您的饮食偏好与职场生活节奏，生成更贴合口味的个性化方案。让健康不再是负担，而是一种可以轻松坚持的日常习惯。"
        },
        {
          id: "followPlan",
          badge: "饮食计划",
          title: "少一点纠结，多一点调理",
          summary: "阶段性调理计划，结合地理位置推荐周边餐厅",
          desc: "基于您的体质、症状与实时地理位置，我们结合中医周期理论，为您生成清晰的2周饮食调理计划。每日每餐都有明确建议，并提供多种备选（包括符合调理方向的周边餐厅），让您在忙碌的工作日无需思考“吃什么”。"
        },
        {
          id: "trackEffort",
          badge: "饮食打卡",
          title: "Progress over perfection",
          summary: "拍照记录与简单反馈，逐步减少反复的肠胃问题",
          desc: "每次用餐后，通过上传照片快速记录。系统将基于图像识别分析食材属性，并与计划进行匹配。通过简单的打卡反馈，平台帮助您持续调整饮食模式，逐步建立可持续的健康饮食习惯。"
        },
        {
          id: "adaptRealTime",
          badge: "AI 调整",
          title: "Adapt in Real Time",
          summary: "根据生活习惯与当天状态动态调整计划",
          desc: "根据当天状态与生活节奏动态调整计划，让方案始终贴合真实的职场生活。通过与 AI 助手对话，随时随地优化您的健康方案。"
        }
      ]
    },
    hero: {
      badge: "自律即免费",
      title: "把“该吃什么”，变成“现在就能吃什么”",
      subtitle: "AI中医体质分析 + 周边餐厅推荐。\n帮你把健康饮食变成可执行选择。",
      ctaPrimary: "免费试用",
      ctaSecondary: "查看今日方案",
      ctaIncentive: "——预约用户可以在首月试用获得更多奖励",
      users: "已心动加入挑战预约，一起来加油吧"
    },
    pain: {
      title: "你不是不想健康，是很难坚持",
      items: [
        {
          title: "知道但做不到",
          desc: "我知道什么是健康的，但中医的复杂性和忙碌的职场生活让我觉得执行起来几乎不可能。"
        },
        {
          title: "外卖无法控制",
          desc: "我的办公室午餐简直是一场赌博。我在附近找不到符合我体质的餐食。"
        },
        {
          title: "吃完焦虑",
          desc: "每餐后我都感到胀气和不适，这让我不断担心自己的消化健康。"
        }
      ],
      summary: "现在加入一起坚持，不仅可以拿回自己的契约金，还可以瓜分未能坚持的人的契约金！一起来加油吧！"
    },
    betting: {
      title: "这不是一个靠意志力的健康App",
      subtitle: "你坚持，就能拿回你的钱。你不是在付费，而是在“和自己打赌”。",
      summary: "契约金额：9.9 新币/月 —— 你不是在付费，而是在“和自己打赌”",
      steps: [
        {
          title: "存入契约金",
          desc: "存入每月 9.9 新币的契约金。这是你的“赌注”，确保你不会轻易放弃。"
        },
        {
          title: "每日打卡",
          desc: "按建议饮食并每日拍照打卡。用数据证明你的坚持。"
        },
        {
          title: "全额返还 + 奖励",
          desc: "每 14 天为一个结算周期，计算成功天数。若 14 天时未选择返现则为继续前进，到 28 天时统一结算成功天数并获得 100% 返还及奖金。"
        }
      ],
      milestones: [
        { days: "坚持 7 天", reward: "返现 30%", desc: "初步养成习惯" },
        { days: "坚持 14 天", reward: "返现 50%", desc: "建立稳定性" },
        { days: "坚持 21 天", reward: "返现 70%", desc: "深化习惯" },
        { days: "坚持 28 天", reward: "返现 100%", desc: "彻底蜕变" }
      ],
      whyTitle: "坚持就不亏，坚持还能赚",
      whyDesc: "让健康成为你最稳健的投资，每一天都在为自己增值。",
      completionRate: "完成率",
      avgReward: "月均奖励"
    },
    howItWorks: {
      title: "运作流程",
      steps: [
        {
          title: "中医智慧，现代生活",
          badge: "体质测评",
          summary: "",
          desc: "基于中医经典“十问”体系，我们将传统辨证逻辑转化为简洁直观的交互。用户无需专业知识，只需通过日常感受的选择，即可快速获取体质分析结果，了解阴阳平衡与脾胃状态。"
        },
        {
          title: "个性化方案，不设限",
          badge: "饮食偏好",
          summary: "",
          desc: "结合中医理论与您的个人饮食偏好，生成更贴合口味的方案。让健康不再是负担，而是一种可以轻松坚持的日常习惯。"
        },
        {
          title: "少一点纠结，多一点调理",
          badge: "饮食计划",
          summary: "",
          desc: "为您生成清晰的 14 天结构化调理计划。每日每餐都有明确建议与多种备选，让您无需思考“吃什么”，也能灵活选择。"
        },
        {
          title: "持续进步，而非瞬间完美",
          badge: "饮食打卡",
          summary: "",
          desc: "通过上传食物照片，AI 将分析食材属性并与调理计划匹配。即使无法完全按推荐执行，您也能了解饮食与目标的匹配程度，从而做出更有依据的调整。"
        },
        {
          title: "实时动态调整",
          badge: "AI 调整",
          summary: "",
          desc: "根据当天状态与生活节奏动态调整计划。通过与 AI 助手对话，随时随地优化您的健康方案，让方案始终贴合真实的职场生活。"
        }
      ],
      conclusion: "坚持 → 返现 → 形成习惯",
      knowledgeBase: "中医知识库"
    },
    faq: {
      title: "常见问题",
      questions: [
        {
          q: "我经常需要外食，还能执行计划吗？",
          a: "完全可以。炁 Qì 会根据您的实时地理位置，推荐周边符合您中医体质和阶段性调理计划的餐厅（从写字楼食堂到周边餐馆）。即使工作繁忙，也能轻松找到适合自己的健康选择。"
        },
        {
          q: "AI 是如何分析我的肠胃健康的？",
          a: "通过结合您的体质分析（基于“十问”和舌象）、症状反馈以及生活习惯，我们的 AI 会识别出身体失衡的模式，并生成阶段性的调理方案，逐步减少反复的不适感，增强脾胃功能。"
        },
        {
          q: "契约金真的会退还吗？",
          a: "是的。只要您在周期内完成每日任务（饮食打卡和简单的状态反馈），契约金将全额退还。我们利用行为经济学中的“损失厌恶”心理，帮助您克服建立新习惯时的惰性。"
        },
        {
          q: "如果我没法完全按照计划吃怎么办？",
          a: "我们追求的是“持续的进步”而非“瞬间的完美”。图像识别会分析您的实际饮食并给出匹配度评估。重点在于帮助您持续调整饮食模式，而不是强迫您执行限制性的饮食。"
        }
      ]
    },
    footer: {
      desc: "古老智慧，现代自律。我们的使命是让中医平衡变得简单、易坚持且充满回报。",
      contact: "联系我们：E1576500@u.nus.edu",
      rights: "© 2026 炁 Qì Balance. 保留所有权利。"
    },
    cta: {
      title: "准备好为健康做出承诺了吗？",
      subtitle: "加入 99+ 名用户，将自律转化为收益。今天就开始您的 7 天免费试用。",
      missionTitle: "🌱 Mission（我们现在在做什么）",
      missionDesc: "让通过日常饮食实现的个性化调理变得简单且可执行。",
      visionTitle: "Vision（我们想改变什么）",
      visionDesc: "一个人们了解自己身体并与之和谐共处的饮食世界。",
      button: "免费试用",
      incentiveTitle: "前 500 名用户将获得：",
      incentives: [
        "额外奖励加成",
        "优先参与正式挑战资格"
      ],
      waitlist: "当前为内测预约 · 正式挑战即将开放",
      secure: "安全支付保障",
      community: "社区驱动"
    }
  }
};

const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof translations['en'];
  openWaitlist: () => void;
  rewardAmount: number;
  incrementReward: () => void;
  flippedStates: boolean[];
  handleFlip: (index: number) => void;
  resetPlates: () => void;
} | null>(null);

const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
};

// const WaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
//   const { t, incrementReward } = useTranslation();
//   const [contactInfo, setContactInfo] = useState('');
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (contactInfo && !isSubmitting) {
//       setIsSubmitting(true);
//       try {
//         await saveLead(contactInfo);
//         setIsSubmitted(true);
//         incrementReward();
//       } catch (error) {
//         alert('Failed to join waitlist. Please try again.');
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

const WaitlistModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { t, incrementReward } = useTranslation();
  const [contactInfo, setContactInfo] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactInfo && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await saveLead(contactInfo);
        setIsSubmitted(true);
        incrementReward();
      } catch (error) {
        alert('Failed to join waitlist. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 在 onClose 触发时，派发自定义事件
  const handleClose = () => {
    onClose();
    document.dispatchEvent(new CustomEvent('waitlistModalClose'));  // 触发事件
  };

  

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-sage-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-warm-50 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-sage-100 transition-colors text-sage-400 hover:text-sage-600"
            >
              <X size={24} />
            </button>

            <div className="p-10">
              {!isSubmitted ? (
                <>
                  <div className="w-16 h-16 bg-sage-100 text-sage-600 rounded-2xl flex items-center justify-center mb-8">
                    <Mail size={32} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-sage-900 mb-4 tracking-tight">{t.waitlistModal.title}</h2>
                  <p className="text-sage-600 mb-8 leading-relaxed font-sans">{t.waitlistModal.subtitle}</p>

                  <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                    <input
                      type="text"
                      required
                      placeholder={t.waitlistModal.contactPlaceholder}
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl border border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-600/20 focus:border-sage-600 transition-all bg-white font-sans"
                    />
                    <button
                      disabled={isSubmitting}
                      className="w-full bg-sage-600 text-warm-50 py-4 rounded-2xl font-bold hover:bg-sage-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '...' : t.waitlistModal.button}
                    </button>
                  </form>

                  <div className="bg-sage-100/50 rounded-2xl p-6 border border-sage-200/50">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-sage-500 mb-4">{t.waitlistModal.incentiveTitle}</h3>
                    <ul className="space-y-3">
                      {t.waitlistModal.incentives.map((incentive, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-medium text-sage-700">
                          <CheckCircle2 size={16} className="text-sage-500" />
                          {incentive}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-6 text-[10px] text-center text-sage-400 italic">
                    {t.waitlistModal.trust}
                  </p>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-sage-900 mb-4 tracking-tight">{t.waitlistModal.success}</h2>
                  <p className="text-sage-600 leading-relaxed font-sans">
                    We've added <strong>{contactInfo}</strong> to our early access list. We'll reach out as soon as a spot opens up!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, setLang, t, openWaitlist } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "bg-warm-50/80 backdrop-blur-md border-b border-sage-100 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sage-600 transition-transform hover:scale-110 cursor-pointer">
            <Leaf size={32} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-tighter text-sage-900 leading-none">炁 Qì</span>
            <span className="text-[10px] font-bold text-sage-500 uppercase tracking-[0.2em] leading-none mt-1">Balance</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-sage-700">
          <a href="#how-it-works" className="hover:text-sage-900 transition-colors">{t.nav.howItWorks}</a>
          <a href="#betting" className="hover:text-sage-900 transition-colors">{t.nav.betting}</a>
          <a href="#faq" className="hover:text-sage-900 transition-colors">{t.nav.faq}</a>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
            className="p-2 rounded-full hover:bg-sage-100 transition-colors text-sage-600 flex items-center gap-2"
          >
            <Languages size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">{lang === 'en' ? '中文' : 'EN'}</span>
          </button>
          <button
            onClick={openWaitlist}
            className="bg-sage-600 text-warm-50 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-sage-700 transition-all shadow-sm hover:shadow-md"
          >
            {t.nav.startTrial}
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { lang, t, openWaitlist } = useTranslation();
  return (
    <section className="relative pt-32 pb-12 overflow-hidden bg-gradient-to-b from-sage-50/50 to-warm-50">
      {/* Large Background Branding */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none pointer-events-none opacity-[0.03]">
        <span className="text-[40rem] font-serif leading-none">炁</span>
      </div>

      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path fill="#5a755a" d="M44.7,-76.4C58.1,-69.2,69.2,-56.9,77.3,-42.8C85.4,-28.7,90.5,-12.8,89.4,2.7C88.3,18.2,81,33.3,71.2,46.1C61.4,58.9,49.1,69.4,35.1,75.8C21.1,82.2,5.4,84.5,-10.1,82.8C-25.6,81.1,-40.9,75.4,-54,66.1C-67.1,56.8,-78,43.9,-83.4,29.3C-88.8,14.7,-88.7,-1.6,-84.4,-16.8C-80.1,-32,-71.6,-46.1,-59.8,-53.8C-48,-61.5,-32.9,-62.8,-19.5,-70C-6.1,-77.2,5.6,-90.3,19.5,-90.3C33.4,-90.3,44.7,-76.4,44.7,-76.4Z" transform="translate(200 200)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <Leaf size={14} fill="currentColor" />
              <span>炁 Qì • {t.hero.badge}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-sage-900 mb-8 tracking-tighter">
              {lang === 'en' ? (
                <>
                  Turn <span className="text-sage-400 font-medium">“what you should eat”</span> <br className="hidden md:block" />
                  into <span className="text-emerald-600">“what you can eat right now.”</span>
                </>
              ) : (
                <>
                  把 <span className="text-sage-400 font-medium">“该吃什么”</span> <br className="hidden md:block" />
                  变成 <span className="text-emerald-600">“现在就能吃什么”</span>
                </>
              )}
            </h1>
            <p className="text-lg text-sage-600 mb-8 max-w-lg leading-relaxed font-sans whitespace-pre-line">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col gap-6">
              <button
                onClick={openWaitlist}
                className="bg-sage-600 text-warm-50 px-12 py-5 rounded-full text-xl font-medium hover:bg-sage-700 transition-all shadow-[0_20px_50px_rgba(90,117,90,0.3)] hover:shadow-[0_20px_60px_rgba(90,117,90,0.4)] flex items-center justify-center gap-3 w-fit group"
              >
                {t.hero.ctaPrimary}
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-sage-500 opacity-80 pl-4 border-l-2 border-sage-200">
                {t.hero.ctaIncentive}
              </p>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-warm-50"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div className="text-sm text-sage-500">
                <span className="font-bold text-sage-900">99+</span> {t.hero.users}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-2xl border border-sage-100">
              {lang === 'zh' ? (
                <video 
                  src="input_file_0.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="rounded-[2rem] w-full aspect-[4/5] object-cover"
                />
              ) : (
                <img 
                  src="https://picsum.photos/seed/tcm-app/800/1000" 
                  alt="App Interface" 
                  className="rounded-[2rem] w-full aspect-[4/5] object-cover"
                  referrerPolicy="no-referrer"
                />
              )} */}
            <div className="relative z-10 flex justify-center">
              <video
                src={appVideos[lang].hero}
                autoPlay
                loop
                muted
                playsInline
                className="rounded-[2rem] h-[720px] w-auto max-w-full object-contain"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-sage-50 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <TrendingUp size={18} />
                  </div>
                  <span className="text-xs font-bold text-sage-900">Health Score</span>
                </div>
                <div className="text-2xl font-serif font-bold text-sage-900">+12%</div>
                <div className="text-[10px] text-sage-500 mt-1 italic">Consistency pays off!</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const PainPoints = () => {
  const { t, lang } = useTranslation();
  return (
    <section className="py-16 bg-warm-50 overflow-hidden border-t border-sage-100/50">
      <div className="w-full px-6 md:px-12">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-sage-900 leading-[1.1] tracking-tight max-w-4xl mx-auto">
            {t.pain.title}
          </h2>
          <div className="mt-8 w-16 h-1.5 bg-sage-200 mx-auto rounded-full" />
        </div>

        <div className="space-y-3 relative max-w-5xl mx-auto mb-16">
          {t.pain.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className={cn(
                "flex w-full",
                i % 2 === 0 ? "justify-start" : "justify-end"
              )}
            >
              <div className={cn(
                "relative max-w-[95%] md:max-w-[620px] p-3 md:p-4 rounded-[1.25rem] shadow-sm border transition-all hover:shadow-md",
                i % 2 === 0
                  ? "bg-sage-600 text-warm-50 border-sage-500 rounded-tl-none"
                  : "bg-white border-sage-100 rounded-tr-none"
              )}>
                {/* Bubble Tail */}
                <div className={cn(
                  "absolute top-0 w-5 h-5",
                  i % 2 === 0
                    ? "-left-5 text-sage-600"
                    : "-right-5 text-white"
                )}>
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
                    {i % 2 === 0 ? (
                      <path d="M16 0 L0 0 L16 16 Z" />
                    ) : (
                      <path d="M0 0 L16 0 L0 16 Z" />
                    )}
                  </svg>
                </div>

                <div className="flex items-center gap-4 md:gap-5">
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-inner",
                    i % 2 === 0 ? "bg-sage-500/30 text-warm-50" : "bg-sage-50 text-sage-600"
                  )}>
                    {i === 0 && <Brain size={18} />}
                    {i === 1 && <ShoppingBag size={18} />}
                    {i === 2 && <HeartPulse size={18} />}
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      "text-lg md:text-xl font-serif font-bold mb-1 tracking-tight",
                      i % 2 === 0 ? "text-warm-50" : "text-sage-900"
                    )}>{item.title}</h3>
                    <p className={cn(
                      "text-sm md:text-base leading-relaxed opacity-90 font-sans",
                      i % 2 === 0 ? "text-warm-50/90" : "text-sage-600"
                    )}>{item.desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-32 text-center"
        >
          <div className="h-px w-24 bg-sage-200 mx-auto mb-12" />
          <h3 className="text-3xl md:text-5xl font-serif font-bold text-sage-900 leading-tight mb-10 tracking-tight max-w-9xl mx-auto">
            {t.pain.summary}
          </h3>
          <button
            onClick={() => {
              const el = document.getElementById('cta');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sage-600 font-bold uppercase tracking-[0.3em] text-xs hover:text-sage-900 transition-colors group"
          >
            {lang === 'zh' ? '立即开启健康之旅' : 'START YOUR JOURNEY'}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const BettingModel = () => {
  const { t, lang } = useTranslation();
  return (
    <section id="betting" className="py-20 bg-sage-900 text-warm-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-medium mb-6 w-full md:w-auto">
            {t.betting.title}
          </h2>
          <p className="text-lg opacity-80 leading-relaxed mb-4">
            {t.betting.subtitle}
          </p>
          <div className="inline-block px-4 py-2 bg-sage-800 rounded-full text-sm font-medium text-sage-300 border border-sage-700">
            {t.betting.summary}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {t.betting.steps.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, backgroundColor: 'rgba(44, 71, 60, 0.6)' }}
              className="bg-sage-800/40 border border-sage-700/50 p-10 rounded-[2.5rem] transition-colors duration-300 backdrop-blur-sm shadow-xl"
            >
              <div className="mb-8 w-14 h-14 bg-sage-700/50 rounded-2xl flex items-center justify-center shadow-inner">
                {i === 0 && <Wallet className="text-emerald-400" size={28} />}
                {i === 1 && <CheckCircle2 className="text-emerald-400" size={28} />}
                {i === 2 && <Award className="text-emerald-400" size={28} />}
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 tracking-tight">{item.title}</h3>
              <p className="text-base opacity-70 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Cashback Milestones */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {t.betting.milestones.map((milestone, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-4 rounded-[2rem] text-center backdrop-blur-sm hover:bg-white/10 transition-colors group"
            >
              <div className="text-emerald-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3 opacity-80 group-hover:opacity-100 transition-opacity">{milestone.days}</div>
              <div className="text-3xl font-serif font-bold mb-2 tracking-tighter">{milestone.reward}</div>
              <div className="text-[11px] opacity-40 group-hover:opacity-60 transition-opacity font-medium">{milestone.desc}</div>
            </motion.div>
          ))}
        </div>

        <div className="p-10 bg-sage-800/60 rounded-[3rem] border border-sage-700/50 flex flex-col md:flex-row items-center gap-12 backdrop-blur-md shadow-2xl">
          <div className="flex-1">
            <h4 className="text-3xl font-serif font-bold mb-6 tracking-tight">{t.betting.whyTitle}</h4>
            <p className="text-base opacity-70 leading-relaxed font-light max-w-xl">
              {t.betting.whyDesc}
            </p>
          </div>
          <div className="flex gap-10 items-center">
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-emerald-400 tracking-tighter">92%</div>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 mt-2 font-bold">{t.betting.completionRate}</div>
            </div>
            <div className="w-px h-16 bg-sage-700/50"></div>
            <div className="text-center">
              <div className="text-4xl font-serif font-bold text-emerald-400 tracking-tighter">
                {lang === 'zh' ? '9.9 新币' : 'SGD 9.90'}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-40 mt-2 font-bold">{t.betting.avgReward}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const VideoCard = ({
  step,
  index,
  hoveredIndex,
  setHoveredIndex,
  videoSrc
}: {
  step: any;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
  videoSrc: string;
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (hoveredIndex === index) {
      videoRef.current?.play().catch(() => { });
    } else {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [hoveredIndex, index]);

  return (
    <motion.div
      onMouseEnter={() => setHoveredIndex(index)}
      onTouchStart={() => setHoveredIndex(index)}
      className="flex-shrink-0 w-[400px] snap-center"
    >
      <div className={cn(
        "bg-white rounded-[2.5rem] overflow-hidden shadow-sm border transition-all duration-500 flex flex-col h-full group",
        hoveredIndex === index ? "border-sage-600 shadow-xl ring-2 ring-sage-600/10" : "border-sage-100"
      )}>
        {/* Video Section - 380x675 (9:16) */}
        <div className="w-[400px] h-[720px] overflow-hidden relative bg-sage-900 flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            playsInline
            className="h-full max-h-[680px] w-auto max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute top-6 left-6">
            <div className="w-10 h-10 bg-white/90 backdrop-blur-sm text-sage-900 rounded-full flex items-center justify-center font-bold shadow-sm">
              {index + 1}
            </div>
          </div>
          {/* Overlay for play hint */}
          <AnimatePresence>
            {hoveredIndex !== index && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Zap className="text-white animate-pulse" size={24} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content Area - Moved back to Bottom */}
        <div className="p-8 flex-1 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sage-100 text-sage-700 text-lg font-bold uppercase tracking-widest mb-4 w-fit">
            {step.badge}
          </div>

          <h3 className="text-2xl md:text-3xl font-serif font-bold text-sage-900 leading-tight whitespace-pre-line">
            {step.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

const HowItWorks = () => {
  const { t, lang } = useTranslation();
  const stepVideos = appVideos[lang].steps;
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = React.useState({ right: 0, left: 0 });
  const x = useMotionValue(0);

  React.useEffect(() => {
    const updateConstraints = () => {
      if (scrollRef.current && containerRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        setDragConstraints({
          right: 0,
          left: -(scrollWidth - containerWidth + 48) // 48 for padding/gap
        });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [t.howItWorks.steps]);

  const handleWheel = (e: React.WheelEvent) => {
    // Keep mouse wheel vertical scrolling untouched.
    // Only react to horizontal touchpad swipes.
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) {
      return;
    }
    e.preventDefault();
    const newX = x.get() - e.deltaX;
    const clampedX = Math.max(Math.min(0, newX), dragConstraints.left);
    x.set(clampedX);
  };

  return (
    <section id="how-it-works" className="py-24 bg-warm-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6" ref={containerRef}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-sage-900 mb-4">{t.howItWorks.title}</h2>
          {/* Drag Hint */}
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2 text-sage-400 text-[10px] font-bold uppercase tracking-widest">
              <ArrowRight size={12} className="rotate-180" />
              <span>{lang === 'zh' ? '拖拽或触控板横向滑动探索 5 个步骤' : 'Drag or swipe on trackpad to explore all 5 steps'}</span>
              <ArrowRight size={12} />
            </div>
          </div>
        </div>

        {/* Expanded Content Section - Moved Above */}
        <div className="relative min-h-[120px] mb-16">
          <AnimatePresence mode="wait">
            {hoveredIndex !== null && (
              <motion.div
                key={hoveredIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full bg-white rounded-[1.5rem] p-6 shadow-md border border-sage-100 relative"
              >
                {/* Visual Pointer/Caret - Pointing Down */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-b border-r border-sage-100 rotate-45 z-10" />

                <div className="max-w-2xl mx-auto text-center">
                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-sage-600 text-warm-50 rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                      {hoveredIndex + 1}
                    </div>
                    <h4 className="text-xl md:text-2xl font-serif font-bold text-sage-900 whitespace-pre-line">
                      {t.howItWorks.steps[hoveredIndex].title}
                    </h4>
                  </div>

                  <div className="mt-6">
                    <p className="text-base md:text-lg text-sage-700 leading-relaxed max-w-2xl mx-auto">
                      {t.howItWorks.steps[hoveredIndex].desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative mb-12 cursor-grab active:cursor-grabbing" onWheel={handleWheel}>
          {/* Draggable Container */}
          <motion.div
            ref={scrollRef}
            style={{ x }}
            drag="x"
            dragConstraints={dragConstraints}
            className="flex gap-6 pb-12 no-scrollbar"
          >
            {t.howItWorks.steps.map((step, i) => (
  <VideoCard
    key={i}
    step={step}
    index={i}
    hoveredIndex={hoveredIndex}
    setHoveredIndex={setHoveredIndex}
    videoSrc={stepVideos[i]}
  />
))}
          </motion.div>
        </div>

        {/* <div className="text-center">
          <div className="inline-flex items-center gap-4 text-sage-500 font-serif italic text-xl md:text-2xl">
            <span>{t.howItWorks.conclusion.split(' → ')[0]}</span>
            <ArrowRight size={20} className="text-sage-300" />
            <span>{t.howItWorks.conclusion.split(' → ')[1]}</span>
            <ArrowRight size={20} className="text-sage-300" />
            <span className="text-sage-800 font-bold">{t.howItWorks.conclusion.split(' → ')[2]}</span>
          </div>
        </div> */}
        <div className="text-center">
  <div className="inline-flex flex-wrap items-center gap-2 md:gap-4 text-sage-500 font-serif italic text-base md:text-xl lg:text-2xl">
    <span className="w-full md:w-auto">{t.howItWorks.conclusion.split(' → ')[0]}</span>
    <ArrowRight size={18} className="text-sage-300 md:text-sage-400" />
    <span className="w-full md:w-auto">{t.howItWorks.conclusion.split(' → ')[1]}</span>
    <ArrowRight size={18} className="text-sage-300 md:text-sage-400" />
    <span className="text-sage-800 font-bold w-full md:w-auto">{t.howItWorks.conclusion.split(' → ')[2]}</span>
  </div>
</div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { t, openWaitlist } = useTranslation();
  return (
    <section id="cta" className="py-24 bg-sage-600 text-warm-50 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-warm-50 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-warm-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <div className="mb-12 flex flex-col items-center">
          <h3 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter text-warm-50 mb-1">炁 Qì</h3>
          <div className="text-xs font-bold text-sage-200 uppercase tracking-[0.6em] opacity-60">Balance</div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 tracking-tight leading-tight">{t.cta.title}</h2>
          <p className="text-xl md:text-2xl opacity-90 mb-12 leading-relaxed font-light">
            {t.cta.subtitle}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-sage-700/40 backdrop-blur-sm rounded-[2rem] p-8 border border-sage-500/30 flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-sage-200">{t.cta.incentiveTitle}</h3>
              <div className="space-y-4 w-full">
                {t.cta.incentives.map((incentive, i) => (
                  <div key={i} className="flex items-center gap-4 bg-sage-800/30 p-3 rounded-xl border border-white/5">
                    <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-sm font-medium text-left">{incentive}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center gap-6">
              <button
                onClick={openWaitlist}
                className="w-full bg-warm-50 text-sage-900 px-10 py-6 rounded-[2rem] text-2xl font-bold hover:bg-white transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 group"
              >
                {t.cta.button}
                <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="flex flex-col items-center gap-3 opacity-70">
                <p className="text-xs italic">
                  {t.cta.waitlist}
                </p>
                <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span>{t.cta.secure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{t.cta.community}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="flex flex-col gap-8 pt-12 border-t border-white/10">
            <div className="text-center">
              <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-sage-300 mb-4 opacity-80 flex items-center justify-center gap-4">
                <span className="w-12 h-px bg-sage-500/30" />
                {t.cta.missionTitle}
                <span className="w-12 h-px bg-sage-500/30" />
              </h4>
              <p className="text-xl md:text-2xl font-serif italic text-warm-50 leading-relaxed max-w-2xl mx-auto">
                "{t.cta.missionDesc}"
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-sage-300 mb-4 opacity-80 flex items-center justify-center gap-4">
                <span className="w-12 h-px bg-sage-500/30" />
                {t.cta.visionTitle}
                <span className="w-12 h-px bg-sage-500/30" />
              </h4>
              <p className="text-xl md:text-2xl font-serif italic text-warm-50 leading-relaxed max-w-2xl mx-auto">
                "{t.cta.visionDesc}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-warm-50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-serif font-medium text-sage-900 mb-12 text-center">{t.faq.title}</h2>
        <div className="space-y-4">
          {t.faq.questions.map((faq, i) => (
            <div key={i} className="border-b border-sage-100">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full py-6 flex items-center justify-between text-left group"
              >
                <span className="text-lg font-serif font-medium text-sage-800 group-hover:text-sage-600 transition-colors">{faq.q}</span>
                <ChevronDown className={cn("text-sage-400 transition-transform", openIndex === i && "rotate-180")} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-sage-600 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AdminLeadsView = ({ leads }: { leads: Lead[] }) => {
  const { lang } = useTranslation();

  return (
    <section className="py-24 bg-white border-t border-sage-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-sage-900 mb-2">
              {lang === 'zh' ? '预约用户列表' : 'Waitlist Leads'}
            </h2>
            <p className="text-sage-500 text-sm">
              {lang === 'zh' ? `共收到 ${leads.length} 条预约信息` : `Total ${leads.length} leads collected`}
            </p>
          </div>
          <div className="p-3 bg-sage-100 text-sage-600 rounded-2xl">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-warm-50 rounded-[2rem] border border-sage-100 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sage-100/50 border-b border-sage-100">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-sage-500">
                  {lang === 'zh' ? '联系方式' : 'Contact Info'}
                </th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-sage-500">
                  {lang === 'zh' ? '提交时间' : 'Submitted At'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100">
              {leads.length > 0 ? leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white transition-colors">
                  <td className="px-8 py-5 font-medium text-sage-900">{lead.email}</td>
                  <td className="px-8 py-5 text-sage-500 text-sm flex items-center gap-2">
                    <Calendar size={14} />
                    {lead.createdAt?.toDate().toLocaleString() || 'Pending...'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="px-8 py-12 text-center text-sage-400 italic">
                    {lang === 'zh' ? '暂无预约数据' : 'No leads yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t, lang } = useTranslation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleAdminAuth = async () => {
    try {
      if (user) {
        await signOut();
      } else {
        await signIn();
      }
    } catch (error) {
      alert(lang === 'zh' ? '管理员登录失败，请重试。' : 'Admin login failed. Please try again.');
    }
  };

  const isAdmin = user?.email === "chenliuxi0519@gmail.com";

  return (
    <footer className="bg-sage-900 text-warm-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="text-warm-50">
                <Leaf size={32} fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-bold tracking-tighter text-warm-50 leading-none">炁 Qì</span>
                <span className="text-[10px] font-bold text-sage-400 uppercase tracking-[0.2em] leading-none mt-1">Balance</span>
              </div>
            </div>
            <p className="text-sm opacity-60 max-w-sm leading-relaxed">
              {t.footer.desc}
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-4 text-sage-300">Contact</h4>
            <p className="text-sm opacity-70 leading-relaxed flex items-center gap-2">
              <Mail size={16} />
              {t.footer.contact}
            </p>

            {/* Admin Login Button */}
            <button
              onClick={handleAdminAuth}
              className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-sage-500 hover:text-sage-300 transition-colors w-fit"
            >
              {user ? (
                <>
                  <LogOut size={12} />
                  {lang === 'zh' ? '退出管理' : 'Logout Admin'} ({user.email})
                </>
              ) : (
                <>
                  <Lock size={12} />
                  {lang === 'zh' ? '管理员登录' : 'Admin Login'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="pt-10 border-t border-sage-800 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest opacity-40">
          <div>{t.footer.rights}</div>
          <div className="flex gap-8">
            <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Twitter</a>
            <a href="#" className="hover:opacity-100 transition-opacity">WeChat</a>
          </div>
        </div>
      </div>
    </footer>
  );
};


const FloatingRewardPool = () => {
  const { rewardAmount, lang, openWaitlist } = useTranslation();
  const isDragging = useRef(false);

  const handleClick = () => {
    if (isDragging.current) return;
    openWaitlist();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      drag
      dragConstraints={{ left: -window.innerWidth + 300, right: 0, top: 0, bottom: window.innerHeight - 200 }}
      whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
      onDragStart={() => { isDragging.current = true; }}
      onDragEnd={() => { setTimeout(() => { isDragging.current = false; }, 0); }}
      className="fixed top-24 right-6 z-[60] group cursor-pointer"
      onClick={handleClick}
    >
      {/* Background Glow Pulse */}
      <div className="absolute inset-0 bg-amber-400/10 blur-3xl rounded-full animate-pulse group-hover:bg-amber-400/20 transition-colors" />

      <div className="relative bg-sage-900 border border-sage-700 p-3 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col items-center gap-2 hover:border-sage-600 transition-all overflow-hidden min-w-[180px]">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

        <div className="flex items-center gap-3 w-full">
          <div className="relative flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-amber-400/30 blur-lg opacity-40 animate-pulse" />
            <div className="w-10 h-10 bg-amber-400 text-amber-900 rounded-xl flex items-center justify-center shadow-lg">
              <Crown size={24} />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-[9px] font-bold text-sage-400 uppercase tracking-widest mb-0.5">
              {lang === 'zh' ? '预约奖金池' : 'Reward Pool'}
            </div>
            <div className="text-xl font-serif font-bold text-warm-50 tabular-nums leading-none tracking-tight">
              SGD {rewardAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-sage-700 to-transparent my-0.5" />

        <div className="flex flex-col gap-2 w-full">
          <div className="text-[13px] font-bold text-amber-200 text-center italic leading-tight drop-shadow-sm">
            {lang === 'zh' ? '坚持就能瓜分契约奖金！' : 'Stay consistent to share the bonus!'}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-bold text-emerald-400 tracking-wider">LIVE</span>
            </div>
            <div className="flex items-center gap-1 bg-warm-50 px-3 py-1.5 rounded-lg shadow-lg shadow-black/20 group-hover:bg-white transition-all">
              <span className="text-[10px] font-bold text-sage-900 uppercase tracking-tight">
                {lang === 'zh' ? '立即加入' : 'JOIN'}
              </span>
              <ArrowRight size={10} className="text-sage-900 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[9px] font-bold px-2.5 py-1 rounded-full shadow-lg border border-white/20 transform rotate-12 group-hover:rotate-0 transition-all z-20">
        HOT
      </div>
    </motion.div>
  );
};


const PlateDivider = ({ startIndex = 0 }: { startIndex?: number }) => {
  const { lang, flippedStates, handleFlip } = useContext(LanguageContext)!;
  const rowSize = 25;
  const rowStates = flippedStates.slice(startIndex, startIndex + rowSize);

  return (
    <div className="w-full bg-warm-50 py-4 border-y border-sage-100/50 relative overflow-visible z-30">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-3">
        {/* Plates Row */}
        <div className="w-full flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-1">
          {rowStates.map((isFlipped, i) => (
            <motion.div
              key={i}
              onMouseEnter={() => handleFlip(startIndex + i)}
              className="relative w-7 h-7 shrink-0 cursor-pointer group"
              style={{ perspective: '1200px' }}
              whileHover={{ scale: 1.15, zIndex: 10 }}
            >
              <motion.div
                animate={{
                  rotateY: isFlipped ? 180 : 0,
                  z: isFlipped ? [0, 20, 0] : [0, 20, 0]
                }}
                transition={{
                  rotateY: { duration: 0.6, type: "spring", stiffness: 260, damping: 20, mass: 1 },
                  z: { duration: 0.3 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
                className="w-full h-full relative"
              >
                {/* Front: Plate (Vector Weight) */}
                <div
                  className="absolute inset-0 bg-white rounded-full border-2 border-sage-200 shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_2px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Plate Rim Detail */}
                  <div className="absolute inset-[2px] rounded-full border border-sage-100/50" />
                  <div className="w-4 h-4 rounded-full border border-sage-100 bg-sage-50/40 shadow-inner" />
                </div>

                {/* Back: Coin (Vector Weight - Moderate Color) */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-amber-100 via-amber-50 to-amber-200/60 rounded-full border-2 border-amber-200 shadow-[0_2px_4px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center text-amber-600/80 overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {/* Coin Rim Detail */}
                  <div className="absolute inset-[1px] rounded-full border border-amber-200/40" />
                  <div className="relative">
                    <DollarSign size={14} className="drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]" strokeWidth={3} />
                  </div>
                  {/* Shine effect - moderate */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Localized Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="text-[10px] uppercase tracking-widest font-bold text-sage-500 italic"
        >
          {lang === 'zh' ? '今天这顿饭，让你更健康，也赚到了奖励' : 'This meal made you healthier—and earned you rewards'}
        </motion.p>
      </div>
    </div>
  );
};

const HealthSidebar = () => {
  const { lang, flippedStates, resetPlates } = useContext(LanguageContext)!;
  const flippedCount = flippedStates.filter(Boolean).length;
  const healthPercentage = (flippedCount / flippedStates.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      style={{
        bottom: 'max(16px, env(safe-area-inset-bottom))',
        right: 'max(16px, env(safe-area-inset-right))'
      }}
      className="fixed z-50 flex flex-col items-center gap-2 rounded-full border border-sage-100 bg-white/95 p-2 shadow-2xl backdrop-blur-md sm:p-2.5"
    >
      <div className="flex flex-col items-center gap-1">
        <motion.div
          animate={{
            scale: healthPercentage > 0 ? [1, 1.15, 1] : 1,
            rotate: healthPercentage > 0 ? [0, 8, -8, 0] : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <Leaf
            size={14}
            className={cn(
              "transition-colors duration-500 sm:size-4",
              healthPercentage > 0 ? "text-emerald-600" : "text-sage-300"
            )}
          />
        </motion.div>

        <div className="relative h-24 w-3 overflow-hidden rounded-full border border-sage-200 bg-sage-100 shadow-inner sm:h-32">
          {healthPercentage > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute inset-0 bg-emerald-400 blur-[2px]"
            />
          )}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${healthPercentage}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-emerald-600 to-emerald-400"
          />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <span
          className={cn(
            "mb-1 text-[7px] font-bold uppercase tracking-widest text-sage-400 sm:text-[8px]",
            lang === "zh"
              ? "[writing-mode:vertical-rl]"
              : "[writing-mode:vertical-lr] rotate-180"
          )}
        >
          {lang === "zh" ? "健康值" : "Health"}
        </span>

        <div className="mb-2 flex flex-col items-center">
          <motion.span
            key={flippedCount}
            initial={{ scale: 1.2, color: "#10b981" }}
            animate={{ scale: 1, color: "#1c1c1c" }}
            className="text-sm font-serif font-bold leading-none tabular-nums sm:text-base"
          >
            {Math.round(healthPercentage)}
          </motion.span>
          <span className="text-[7px] font-bold text-sage-400 sm:text-[8px]">%</span>
        </div>

        <motion.button
          onClick={resetPlates}
          whileHover={{ rotate: -180, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="rounded-full bg-sage-100 p-1.5 text-sage-500 shadow-sm transition-colors hover:bg-sage-200 hover:text-sage-700"
          title="Reset"
        >
          <RotateCcw size={13} className="sm:size-[14px]" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(970.20);
  const [flippedStates, setFlippedStates] = useState(new Array(50).fill(false));
  const [user, setUser] = useState<User | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const t = translations[lang];

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    let unsubscribeLeads: (() => void) | undefined;

    if (user?.email === "chenliuxi0519@gmail.com") {
      unsubscribeLeads = subscribeToLeads((newLeads) => {
        setLeads(newLeads);
      });
    } else {
      setLeads([]);
    }

    return () => {
      if (unsubscribeLeads) unsubscribeLeads();
    };
  }, [user]);

  const openWaitlist = () => setIsWaitlistOpen(true);
  const incrementReward = () => {
    setRewardAmount(prev => prev + 1.00);
  };

  const handleFlip = (index: number) => {
    setFlippedStates(prev => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const resetPlates = () => {
    setFlippedStates(new Array(50).fill(false));
  };

  const isAdmin = user?.email === "chenliuxi0519@gmail.com";

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      t: translations[lang],
      openWaitlist,
      rewardAmount,
      incrementReward,
      flippedStates,
      handleFlip,
      resetPlates
    }}>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <PlateDivider startIndex={0} />
          <HowItWorks />
          <BettingModel />
          <PlateDivider startIndex={25} />
          <PainPoints />
          <CTA />
          <FAQ />
          {isAdmin && <AdminLeadsView leads={leads} />}
        </main>
        <Footer />
        <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
        <FloatingRewardPool />
        <HealthSidebar />
      </div>
    </LanguageContext.Provider>
  );
}
