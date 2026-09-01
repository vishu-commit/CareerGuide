
const express = require("express");
const router = express.Router();

const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// FREE AI-STYLE CAREER COUNSELLING
// No OpenAI API / No payment required
// =====================================================


// =====================================================
// CAREER KEYWORDS
// =====================================================

const careerKeywords = {

    // =================================================
    // TECHNOLOGY
    // =================================================

    technology: [
        "coding",
        "code",
        "programming",
        "programmer",
        "computer",
        "software",
        "technology",
        "tech",
        "web",
        "website",
        "app",
        "application",
        "developer",
        "development",
        "java",
        "javascript",
        "react",
        "node",
        "python",
        "html",
        "css",
        "backend",
        "frontend",
        "full stack"
    ],


    // =================================================
    // DATA
    // =================================================

    data: [
        "data",
        "analytics",
        "analysis",
        "analyst",
        "mathematics",
        "math",
        "statistics",
        "excel",
        "sql",
        "power bi",
        "tableau",
        "numbers",
        "dashboard"
    ],


    // =================================================
    // AI
    // =================================================

    ai: [
        "artificial intelligence",
        "ai",
        "machine learning",
        "ml",
        "deep learning",
        "chatbot",
        "automation",
        "neural network"
    ],


    // =================================================
    // DESIGN
    // =================================================

    design: [
        "design",
        "designing",
        "designer",
        "ui",
        "ux",
        "ui/ux",
        "website design",
        "creative",
        "creativity",
        "creative work",
        "graphics",
        "graphic",
        "graphic design",
        "figma",
        "photoshop",
        "illustration",
        "illustrator",
        "visual",
        "visual design",
        "art",
        "drawing",
        "sketching",
        "painting",
        "aesthetic",
        "typography",
        "colors",
        "colour",
        "visualization"
    ],


    // =================================================
    // FASHION
    // =================================================

    fashion: [
        "fashion",
        "clothes",
        "clothing",
        "styling",
        "style",
        "fashion design",
        "fashion designer",
        "dress",
        "dresses",
        "outfit",
        "outfits",
        "tailor",
        "tailoring",
        "sewing",
        "stitching",
        "garment",
        "garments",
        "fabric",
        "fabrics",
        "textile",
        "textiles",
        "boutique",
        "fashion industry",
        "fashion industry"
    ],


    // =================================================
    // BEAUTY
    // =================================================

    beauty: [
        "makeup",
        "make up",
        "beauty",
        "cosmetics",
        "cosmetic",
        "hair",
        "hairstyle",
        "hair styling",
        "salon",
        "skin",
        "skincare",
        "makeup artist",
        "beautician",
        "nail art",
        "nails"
    ],


    // =================================================
    // BUSINESS
    // =================================================

    business: [
        "business",
        "entrepreneur",
        "entrepreneurship",
        "startup",
        "start my own",
        "own business",
        "small business",
        "leadership",
        "management",
        "manager",
        "marketing",
        "selling",
        "sales",
        "brand",
        "branding",
        "shop",
        "store",
        "company"
    ],


    // =================================================
    // COMMUNICATION
    // =================================================

    communication: [
        "writing",
        "writer",
        "communication",
        "speaking",
        "content",
        "content creation",
        "content creator",
        "journalism",
        "media",
        "social media",
        "public speaking",
        "storytelling",
        "blogging",
        "blog"
    ],


    // =================================================
    // TEACHING
    // =================================================

    teaching: [
        "teaching",
        "teacher",
        "education",
        "students",
        "helping people",
        "teaching others",
        "mentor",
        "mentoring",
        "training",
        "trainer",
        "explain",
        "explaining"
    ],


    // =================================================
    // HEALTHCARE
    // =================================================

    healthcare: [
        "health",
        "healthcare",
        "medical",
        "medicine",
        "doctor",
        "nurse",
        "hospital",
        "biology",
        "patient",
        "pharmacy",
        "pharmacist",
        "physiotherapy",
        "physiotherapist"
    ],


    // =================================================
    // SPORTS
    // =================================================

    sports: [
        "sports",
        "fitness",
        "gym",
        "exercise",
        "football",
        "cricket",
        "athlete",
        "physical",
        "sports training",
        "coach",
        "fitness trainer"
    ],


    // =================================================
    // FOOD
    // =================================================

    food: [
        "food",
        "cooking",
        "cook",
        "chef",
        "baking",
        "baker",
        "restaurant",
        "cuisine",
        "kitchen",
        "pastry",
        "cake",
        "cakes"
    ],


    // =================================================
    // TRAVEL
    // =================================================

    travel: [
        "travel",
        "tourism",
        "tourist",
        "hotel",
        "hospitality",
        "travelling",
        "traveling",
        "tour guide",
        "tourism industry",
        "trip",
        "travel industry"
    ],


    // =================================================
    // PRACTICAL WORK
    // =================================================

    practical: [
        "hands-on",
        "hands on",
        "practical",
        "repair",
        "machine",
        "mechanical",
        "electrician",
        "carpenter",
        "workshop",
        "field work",
        "fieldwork",
        "construction",
        "technical work"
    ]

};


// =====================================================
// INTEREST NAMES
// =====================================================

const interestNames = {

    technology: "technology and coding",
    data: "data and analytical work",
    ai: "Artificial Intelligence",
    design: "design, creativity and visual work",
    fashion: "fashion and styling",
    beauty: "beauty and makeup",
    business: "business and entrepreneurship",
    communication: "writing and communication",
    teaching: "teaching and helping people",
    healthcare: "healthcare",
    sports: "sports and fitness",
    food: "food and cooking",
    travel: "travel and hospitality",
    practical: "hands-on practical work"

};


// =====================================================
// DETECT INTERESTS
// =====================================================

function detectInterests(text) {

    const lowerText =
        text.toLowerCase();

    const detected = [];


    for (
        const [category, keywords]
        of Object.entries(careerKeywords)
    ) {

        let score = 0;


        keywords.forEach(keyword => {

            const cleanKeyword =
                keyword.toLowerCase();

            if (
                lowerText.includes(cleanKeyword)
            ) {

                score++;

            }

        });


        if (score > 0) {

            detected.push({

                category,

                score

            });

        }

    }


    return detected.sort(
        (a, b) => b.score - a.score
    );

}


// =====================================================
// NORMALIZE TEXT
// =====================================================

function normalizeText(text) {

    return (text || "")
        .toLowerCase()
        .replace(/[^\w\s/.-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


// =====================================================
// CALCULATE CAREER MATCH
// =====================================================

function calculateCareerMatch(
    career,
    message,
    interests
) {

    const text =
        normalizeText(message);


    let score = 0;


    const careerText = [

        career.title,
        career.name,
        career.category,
        career.description,
        career.skills,
        career.job_roles,
        career.education_required

    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();


    // =================================================
    // 1. CATEGORY MATCH
    // =================================================

    interests.forEach(interest => {

        const keywords =
            careerKeywords[
                interest.category
            ] || [];


        keywords.forEach(keyword => {

            if (
                careerText.includes(
                    keyword.toLowerCase()
                )
            ) {

                score +=
                    interest.score * 4;

            }

        });


        // Category itself match
        if (
            career.category &&
            career.category
                .toLowerCase()
                .includes(
                    interest.category
                )
        ) {

            score +=
                interest.score * 8;

        }

    });


    // =================================================
    // 2. WORD MATCH
    // =================================================

    const words =
        text
            .split(/\s+/)
            .filter(
                word => word.length >= 4
            );


    words.forEach(word => {

        if (
            careerText.includes(word)
        ) {

            score += 2;

        }

    });


    // =================================================
    // 3. EXACT CAREER TITLE MATCH
    // =================================================

    const title =
        normalizeText(
            career.title ||
            career.name ||
            ""
        );


    if (
        title &&
        text.includes(title)
    ) {

        score += 30;

    }


    // =================================================
    // 4. IMPORTANT DIRECT MATCHES
    // =================================================

    const directMatches = [

        {
            careerWords: [
                "fashion designer"
            ],
            userWords: [
                "fashion",
                "fashion design",
                "fashion designer",
                "clothes",
                "outfit",
                "dress",
                "tailoring",
                "sewing"
            ],
            points: 20
        },

        {
            careerWords: [
                "graphic designer"
            ],
            userWords: [
                "graphic",
                "graphics",
                "drawing",
                "illustration",
                "photoshop",
                "art"
            ],
            points: 20
        },

        {
            careerWords: [
                "ui/ux designer",
                "ui ux designer",
                "product designer"
            ],
            userWords: [
                "ui",
                "ux",
                "website design",
                "app design",
                "product design",
                "figma"
            ],
            points: 20
        },

        {
            careerWords: [
                "interior designer"
            ],
            userWords: [
                "interior",
                "room design",
                "home design",
                "decoration",
                "decorating"
            ],
            points: 20
        }

    ];


    directMatches.forEach(rule => {

        const careerMatches =
            rule.careerWords.some(
                word =>
                    careerText.includes(
                        word
                    )
            );


        const userMatches =
            rule.userWords.some(
                word =>
                    text.includes(
                        word
                    )
            );


        if (
            careerMatches &&
            userMatches
        ) {

            score += rule.points;

        }

    });


    return score;

}


// =====================================================
// CREATE REASON
// =====================================================

function createReason(
    career,
    interests,
    message
) {

    const careerName =
        career.title ||
        career.name ||
        "this career";


    const text =
        message.toLowerCase();


    // =================================================
    // CAREER SPECIFIC REASONS
    // =================================================

    if (
        careerName
            .toLowerCase()
            .includes("fashion")
    ) {

        return "Your interest in fashion, clothes, styling or creative work makes Fashion Design a strong career option to explore.";

    }


    if (
        careerName
            .toLowerCase()
            .includes("graphic")
    ) {

        return "Your interest in art, graphics, illustration and creativity connects strongly with Graphic Design.";

    }


    if (
        careerName
            .toLowerCase()
            .includes("ui") ||
        careerName
            .toLowerCase()
            .includes("ux")
    ) {

        return "Your creativity and interest in designing digital experiences can make UI/UX Design a suitable career path.";

    }


    if (
        careerName
            .toLowerCase()
            .includes("product designer")
    ) {

        return "Your creative thinking, visual interests and interest in designing useful experiences make Product Design worth exploring.";

    }


    if (
        careerName
            .toLowerCase()
            .includes("interior")
    ) {

        return "Your creativity and interest in visual spaces and design can connect well with Interior Design.";

    }


    // =================================================
    // GENERAL REASONS
    // =================================================

    if (
        interests.length === 0
    ) {

        return `Based on the information you shared, ${careerName} could be worth exploring.`;

    }


    const topInterest =
        interests[0].category;


    const reasons = {

        technology:
            "You mentioned technology, coding or computer-related interests, which can be a strong match for this career.",

        data:
            "You showed interest in data, numbers or analytical work, which can be useful for this career.",

        ai:
            "Your interest in Artificial Intelligence or Machine Learning makes this career worth exploring.",

        design:
            "You mentioned creativity, designing, art or visual work, which connects well with this career.",

        fashion:
            "Your interest in fashion, styling, clothing or creative work makes this career relevant.",

        beauty:
            "Your interest in beauty, makeup or styling makes this career worth considering.",

        business:
            "Your interest in business, leadership or entrepreneurship connects with this career.",

        communication:
            "Your interest in writing, communication or media can be useful in this career.",

        teaching:
            "Your interest in teaching and helping people can make this career a good option.",

        healthcare:
            "Your interest in healthcare and helping people makes this career worth exploring.",

        sports:
            "Your interest in sports and fitness connects with this career.",

        food:
            "Your interest in cooking or food makes this career a relevant option.",

        travel:
            "Your interest in travel and hospitality connects with this career.",

        practical:
            "You mentioned practical or hands-on work, which connects with this career."

    };


    return (
        reasons[topInterest] ||
        `Your interests and the nature of ${careerName} show some potential compatibility.`
    );

}


// =====================================================
// CREATE ANALYSIS
// =====================================================

function createAnalysis(
    message,
    interests,
    recommendations
) {

    if (
        !interests.length
    ) {

        return "Thanks for sharing about yourself. I need a little more information about your interests or the kind of work you enjoy before I can give you useful career suggestions.";

    }


    const detectedNames =
        interests
            .slice(0, 3)
            .map(
                item =>
                    interestNames[
                        item.category
                    ] ||
                    item.category
            );


    let analysis =
        `From what you shared, you seem interested in ${detectedNames.join(", ")}. `;


    if (
        recommendations.length > 0
    ) {

        analysis +=
            `Based on these interests, ${recommendations[0].title} appears to be one of your stronger career options. `;

    }


    analysis +=
        "You don't have to decide immediately. Explore the suggested careers, understand their skills, education requirements, courses and roadmap, and then choose the path that feels right for you.";


    return analysis;

}


// =====================================================
// POST /api/ai-counselling
// =====================================================

router.post(
    "/",
    authMiddleware,
    async (req, res) => {

        try {

            const studentId =
                req.user.id;


            // =================================================
            // GET MESSAGE
            // =================================================

            let message = "";


            if (
                typeof req.body.message ===
                "string"
            ) {

                message =
                    req.body.message.trim();

            }


            // =================================================
            // BACKWARD COMPATIBILITY
            // =================================================

            if (
                !message &&
                req.body.answers
            ) {

                const answers =
                    req.body.answers;


                message =
                    Object.entries(
                        answers
                    )
                        .map(
                            ([key, value]) => {

                                if (
                                    Array.isArray(
                                        value
                                    )
                                ) {

                                    return `${key}: ${value.join(", ")}`;

                                }


                                return `${key}: ${value}`;

                            }
                        )
                        .join(". ");

            }


            // =================================================
            // VALIDATION
            // =================================================

            if (!message) {

                return res.status(400).json({

                    message:
                        "Please tell me something about yourself."

                });

            }


            if (
                message.length < 10
            ) {

                return res.status(400).json({

                    message:
                        "Please tell me a little more about yourself so I can suggest suitable careers."

                });

            }


            console.log(
                "Student message:",
                message
            );


            // =================================================
            // DETECT INTERESTS
            // =================================================

            const interests =
                detectInterests(
                    message
                );


            console.log(
                "Detected interests:",
                interests
            );


            // =================================================
            // FOLLOW-UP
            // =================================================

            if (
                interests.length === 0
            ) {

                return res.json({

                    success: true,

                    type: "question",

                    needs_follow_up: true,

                    message:
                        "What kind of activities do you enjoy most — creative work, technology, business, helping people, practical work, or something else?",

                    follow_up_question:
                        "What kind of activities do you enjoy most — creative work, technology, business, helping people, practical work, or something else?",

                    recommendations: [],

                    analysis:
                        "I understand what you shared, but I need one more detail about the type of work you enjoy before suggesting careers."

                });

            }


            // =================================================
            // GET CAREERS
            // =================================================

            const [careers] =
                await db.promise().query(`

                    SELECT
                        id,
                        title,
                        category,
                        description,
                        skills,
                        eligibility,
                        education_required,
                        job_roles,
                        starting_salary

                    FROM careers

                `);


            // =================================================
            // MATCH CAREERS
            // =================================================

            const scoredCareers =
                careers.map(
                    career => {

                        const score =
                            calculateCareerMatch(
                                career,
                                message,
                                interests
                            );


                        return {

                            ...career,

                            score

                        };

                    }
                );


            // =================================================
            // SORT
            // =================================================

            scoredCareers.sort(
                (a, b) =>
                    b.score - a.score
            );


            // =================================================
            // TOP 5
            // =================================================

            let recommendations =
                scoredCareers
                    .slice(0, 5)
                    .map(
                        (career, index) => {

                            let percentage =
                                55 +
                                Math.min(
                                    career.score * 2,
                                    38
                                );


                            // Best match gets
                            // a small boost
                            if (
                                index === 0
                            ) {

                                percentage =
                                    Math.min(
                                        percentage + 5,
                                        98
                                    );

                            }


                            return {

                                id:
                                    career.id,

                                title:
                                    career.title,

                                category:
                                    career.category,

                                description:
                                    career.description,

                                skills:
                                    career.skills,

                                eligibility:
                                    career.eligibility,

                                education_required:
                                    career.education_required,

                                job_roles:
                                    career.job_roles,

                                starting_salary:
                                    career.starting_salary,

                                match_percentage:
                                    percentage,

                                reason:
                                    createReason(
                                        career,
                                        interests,
                                        message
                                    )

                            };

                        }
                    );


            // =================================================
            // FALLBACK
            // =================================================

            if (
                !recommendations.length
            ) {

                return res.json({

                    success: true,

                    type: "question",

                    needs_follow_up: true,

                    message:
                        "What type of work interests you most?",

                    follow_up_question:
                        "What type of work interests you most?",

                    recommendations: [],

                    analysis:
                        "I couldn't find a strong career match yet. Tell me a little more about your interests."

                });

            }


            // =================================================
            // BEST MATCH
            // =================================================

            const bestMatch =
                recommendations[0];


            // =================================================
            // ANALYSIS
            // =================================================

            const analysis =
                createAnalysis(
                    message,
                    interests,
                    recommendations
                );


            // =================================================
            // SAVE SESSION
            // =================================================

            try {

                await db.promise().query(

                    `INSERT INTO ai_counselling_sessions
                    (
                        student_id,
                        answers,
                        recommended_career,
                        analysis
                    )
                    VALUES (?, ?, ?, ?)`,

                    [

                        studentId,

                        JSON.stringify({

                            message,

                            detected_interests:
                                interests

                        }),

                        bestMatch.title,

                        analysis

                    ]

                );

            } catch (
                dbError
            ) {

                console.log(
                    "Session save warning:",
                    dbError.message
                );

            }


            // =================================================
            // FINAL RESPONSE
            // =================================================

            return res.json({

                success: true,

                type: "result",

                needs_follow_up: false,

                message:
                    `Based on what you shared, I found some career options that may suit you. Your strongest match is ${bestMatch.title}.`,

                original_message:
                    message,

                detected_interests:
                    interests.map(
                        item =>
                            item.category
                    ),

                best_match:
                    bestMatch,

                recommendations,

                analysis

            });

        } catch (
            error
        ) {

            console.error(
                "AI Counselling Error:",
                error
            );


            return res.status(500).json({

                message:
                    "Unable to process your counselling request. Please try again."

            });

        }

    }
);


// =====================================================
// HISTORY
// =====================================================

router.get(
    "/history",
    authMiddleware,
    async (req, res) => {

        try {

            const studentId =
                req.user.id;


            const [sessions] =
                await db.promise().query(

                    `SELECT *
                     FROM ai_counselling_sessions
                     WHERE student_id = ?
                     ORDER BY created_at DESC`,

                    [studentId]

                );


            return res.json({

                success: true,

                sessions

            });

        } catch (
            error
        ) {

            console.error(
                "History Error:",
                error
            );


            return res.status(500).json({

                message:
                    "Unable to fetch counselling history."

            });

        }

    }
);


module.exports = router;

