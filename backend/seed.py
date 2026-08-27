import logging
from app.db.database import SessionLocal, engine, Base
from app.db.models import (
    TeamMember,
    Event,
    GalleryPhoto,
    Announcement,
    ChapterSetting,
    AdminUser,
)
from app.core.security import DEFAULT_ADMIN_EMAILS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")


def seed_database():
    logger.info("Connecting to database and verifying schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. SEED 2026 TEAM MEMBERS
        if db.query(TeamMember).count() == 0:
            logger.info("Seeding 2026 Official Team Directory...")
            team_members = [
                # 1. OFFICE BEARERS
                TeamMember(
                    id="team-ob-1",
                    name="Varun Sudheer",
                    role="Chair",
                    team_type="Office Bearers",
                    department="Biomedical Engineering",
                    year="BME III Year",
                    chapter="SSIT_2026",
                    quote="Some inherit a league. Some dare to build one. I choose to be.",
                    email="varun2410158@ssn.edu.in",
                    photo="",
                    bio="Some inherit a league. Some dare to build one. I choose to be.",
                    order=1,
                    active=True,
                ),
                TeamMember(
                    id="team-ob-2",
                    name="Mohammed Afzal",
                    role="Vice-Chair",
                    team_type="Office Bearers",
                    department="Electrical & Electronics Engineering",
                    year="EEE III Year",
                    chapter="SSIT_2026",
                    quote="Stay grounded, keep growing, and make every moment count.",
                    email="",
                    photo="",
                    bio="Stay grounded, keep growing, and make every moment count.",
                    order=2,
                    active=True,
                ),
                TeamMember(
                    id="team-ob-3",
                    name="Yuva Sriam",
                    role="Secretary",
                    team_type="Office Bearers",
                    department="Biomedical Engineering",
                    year="BME III Year",
                    chapter="SSIT_2026",
                    quote="Chill by nature. Serious when it matters.",
                    email="",
                    photo="",
                    bio="Chill by nature. Serious when it matters.",
                    order=3,
                    active=True,
                ),
                TeamMember(
                    id="team-ob-4",
                    name="Shriram S Syam",
                    role="Joint-Sec",
                    team_type="Office Bearers",
                    department="Electrical & Electronics Engineering",
                    year="EEE III Year",
                    chapter="SSIT_2026",
                    quote="What doesn’t kill you makes you want what likely wont gor? at 6",
                    email="shriram2410046@ssn.edu.in",
                    photo="",
                    bio="What doesn’t kill you makes you want what likely wont gor? at 6",
                    order=4,
                    active=True,
                ),
                TeamMember(
                    id="team-ob-5",
                    name="Smrithi S",
                    role="Treasurer",
                    team_type="Office Bearers",
                    department="Biomedical Engineering",
                    year="BME III Year",
                    chapter="SSIT_2026",
                    quote="I came, I saw, I overthought, I fumbled.",
                    email="",
                    photo="",
                    bio="I came, I saw, I overthought, I fumbled.",
                    order=5,
                    active=True,
                ),
                # 2. WEB DEVELOPMENT TEAM
                TeamMember(
                    id="team-wd-1",
                    name="Nathaniel Christian",
                    role="Head",
                    team_type="Web Development",
                    department="Computer Science & Engineering",
                    year="M.Tech CSE III Year",
                    chapter="SSIT_2026",
                    quote="Never interrupt an enemy when he’s making a mistake.",
                    email="nathaniel2470009@ssn.edu.in",
                    photo="",
                    bio="Never interrupt an enemy when he’s making a mistake.",
                    order=6,
                    active=True,
                ),
                TeamMember(
                    id="team-wd-2",
                    name="Pranav Vasudevan",
                    role="Head",
                    team_type="Web Development",
                    department="Information Technology",
                    year="IT III Year",
                    chapter="SSIT_2026",
                    quote="What?",
                    email="pranav2410328@ssn.edu.in",
                    photo="",
                    bio="What?",
                    order=7,
                    active=True,
                ),
                TeamMember(
                    id="team-wd-3",
                    name="Sharruk S",
                    role="Member",
                    team_type="Web Development",
                    department="Computer Science & Engineering",
                    year="M.Tech CSE III Year",
                    chapter="SSIT_2026",
                    quote="Building the digital face of SSIT.",
                    email="sharruk2470048@ssn.edu.in",
                    photo="",
                    bio="Building the digital face of SSIT.",
                    order=8,
                    active=True,
                ),
                TeamMember(
                    id="team-wd-4",
                    name="Vedika Chandra",
                    role="Member",
                    team_type="Web Development",
                    department="Computer Science & Engineering",
                    year="CSE III Year",
                    chapter="SSIT_2026",
                    quote="The reason your website has trust issues.",
                    email="vedika2410432@ssn.edu.in",
                    photo="",
                    bio="The reason your website has trust issues.",
                    order=9,
                    active=True,
                ),
                TeamMember(
                    id="team-wd-5",
                    name="Harshini PS",
                    role="Member",
                    team_type="Web Development",
                    department="Computer Science & Engineering",
                    year="CSE III Year",
                    chapter="SSIT_2026",
                    quote="Quiet moves, loud results. Plot twists included.",
                    email="harshini2410197@ssn.edu.in",
                    photo="",
                    bio="Quiet moves, loud results. Plot twists included.",
                    order=10,
                    active=True,
                ),
                TeamMember(
                    id="team-wd-6",
                    name="Harshika Sipani",
                    role="Member",
                    team_type="Web Development",
                    department="Computer Science & Engineering",
                    year="CSE III Year",
                    chapter="SSIT_2026",
                    quote="Calm, chaos and everything in between.",
                    email="harshika2410326@ssn.edu.in",
                    photo="",
                    bio="Calm, chaos and everything in between.",
                    order=11,
                    active=True,
                ),
            ]
            db.add_all(team_members)
            db.commit()
            logger.info("Successfully seeded 11 official 2026 team members.")

        # 2. SEED EVENTS
        if db.query(Event).count() == 0:
            logger.info("Seeding initial Chapter Events...")
            events = [
                Event(
                    id="ev-1",
                    title="AI Ethics & Algorithmic Bias in Healthcare Systems",
                    category="Workshop",
                    date="March 15, 2025",
                    time="2:00 PM – 4:30 PM",
                    start_time="14:00",
                    end_time="16:30",
                    location="SSN Central Auditorium / Hybrid",
                    mode="Hybrid",
                    description="An interactive hands-on workshop examining algorithmic transparency, bias mitigation in diagnostic models, and the ethical responsibility of engineers deploying AI in critical healthcare infrastructure.",
                    image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop&auto=format",
                    register_url="https://forms.gle/ssnieee-ai-ethics-2025",
                    speaker="Dr. K. Swaminathan",
                    speaker_role="IIT Madras AI Ethics Lab Lead",
                    deadline="March 14, 2025",
                    featured=True,
                    status="upcoming",
                    published=True,
                ),
                Event(
                    id="ev-2",
                    title="Envision 2025: Tech for Humanity National Hackathon",
                    category="Hackathon",
                    date="April 11–12, 2025",
                    time="36-Hour Hackathon",
                    start_time="09:00",
                    end_time="18:00",
                    location="SSN Innovation & Incubation Centre",
                    mode="In-Person",
                    description="Annual national level hackathon focused on sustainable energy solutions, assistive technologies for disabilities, and reducing the rural digital divide. Cash prizes worth 1.5 Lakhs.",
                    image="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&auto=format",
                    register_url="https://unstop.com/hackathons/envision-2025-ssn",
                    speaker="IEEE SSIT Madras Section Mentors",
                    speaker_role="Industry Advisory Committee",
                    deadline="April 05, 2025",
                    featured=True,
                    status="upcoming",
                    published=True,
                ),
                Event(
                    id="ev-3",
                    title="Universal Digital Inclusion: Bridging Rural Connectivity",
                    category="Chapter Event",
                    date="January 24, 2025",
                    time="3:30 PM – 5:00 PM",
                    start_time="15:30",
                    end_time="17:00",
                    location="Mini Auditorium, SSN CE",
                    mode="In-Person",
                    description="Distinguished panel discussion exploring mesh networking, low-power satellite terminals, and educational access in underserved rural communities across Tamil Nadu.",
                    image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop&auto=format",
                    speaker="Prof. S. Ramanathan & Panel",
                    speaker_role="Senior Members, IEEE",
                    status="completed",
                    published=True,
                ),
                Event(
                    id="ev-4",
                    title="IEEE ISTAS 2025 Chapter Preview & Paper Writing Sprint",
                    category="Symposium",
                    date="May 2, 2025",
                    time="10:00 AM – 1:00 PM",
                    start_time="10:00",
                    end_time="13:00",
                    location="ECE Seminar Hall, SSN",
                    mode="In-Person",
                    description="Mentorship sprint guiding student researchers to prepare, format, and submit conference papers for IEEE International Symposium on Technology and Society (ISTAS 2025).",
                    image="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=500&fit=crop&auto=format",
                    register_url="https://forms.gle/ssn-istas-paper-sprint",
                    deadline="April 28, 2025",
                    featured=False,
                    status="upcoming",
                    published=True,
                ),
            ]
            db.add_all(events)
            db.commit()
            logger.info("Successfully seeded initial events.")

        # 3. SEED GALLERY PHOTOS
        if db.query(GalleryPhoto).count() == 0:
            logger.info("Seeding gallery photos...")
            photos = [
                GalleryPhoto(
                    id="gal-1",
                    url="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&h=550&fit=crop&auto=format",
                    alt="Students at computer workstations during a session",
                    label="Technical Workshop 2025",
                    caption="Hands-on AI ethics testing on real-world datasets.",
                    event_name="AI Ethics & Algorithmic Bias",
                    category="Workshop",
                    date="Feb 2025",
                    featured=True,
                    order=1,
                ),
                GalleryPhoto(
                    id="gal-2",
                    url="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=550&fit=crop&auto=format",
                    alt="Engineering student at a laptop",
                    label="Ethics in AI Research Session",
                    caption="Student researchers analyzing ethical implications.",
                    category="Symposium",
                    date="Jan 2025",
                    order=2,
                ),
                GalleryPhoto(
                    id="gal-3",
                    url="https://images.unsplash.com/photo-1778876088509-982115d463ef?w=800&h=550&fit=crop&auto=format",
                    alt="Audience in SSN lecture hall",
                    label="Chapter Inaugural Symposium",
                    caption="Over 200 students attending the chapter inauguration.",
                    category="Symposium",
                    date="Jan 2025",
                    featured=True,
                    order=3,
                ),
                GalleryPhoto(
                    id="gal-4",
                    url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=1000&fit=crop&auto=format",
                    alt="LED technology panel",
                    label="Assistive Tech Demonstration",
                    caption="Smart assistive hardware prototype for visually impaired.",
                    category="Workshop",
                    date="Nov 2024",
                    featured=True,
                    order=4,
                ),
                GalleryPhoto(
                    id="gal-5",
                    url="https://images.unsplash.com/photo-1782388713336-fcb8aa6db8f0?w=800&h=550&fit=crop&auto=format",
                    alt="Two students collaborating at laptop",
                    label="Envision Hackathon Sprint",
                    caption="Teams building rural connectivity prototypes.",
                    event_name="Envision Hackathon",
                    category="Hackathon",
                    date="Oct 2024",
                    order=5,
                ),
                GalleryPhoto(
                    id="gal-6",
                    url="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=550&fit=crop&auto=format",
                    alt="Student in lab with engineering equipment",
                    label="Hardware Sustainability Lab",
                    caption="Testing e-waste recycling and circular economy circuit boards.",
                    category="Campus",
                    date="Sep 2024",
                    order=6,
                ),
            ]
            db.add_all(photos)
            db.commit()
            logger.info("Successfully seeded gallery photos.")

        # 4. SEED ANNOUNCEMENTS
        if db.query(Announcement).count() == 0:
            logger.info("Seeding announcements...")
            ann = Announcement(
                id="ann-2",
                text="SSIT Student Chapter Call for Core Committee & Web Dev Volunteers for Academic Year 2025–26.",
                cta_text="Join Team",
                cta_url="/membership",
                priority="normal",
                status="active",
                active=False,
                start_date="2025-02-18",
            )
            db.add(ann)
            db.commit()
            logger.info("Successfully seeded announcements.")

        # 5. SEED CHAPTER SETTINGS
        if not db.query(ChapterSetting).filter(ChapterSetting.key == "chapter_info").first():
            logger.info("Seeding chapter_info setting...")
            chapter_info = ChapterSetting(
                key="chapter_info",
                value={
                    "chapterName": "IEEE Society on Social Implications of Technology — SSN Student Branch Chapter",
                    "tagline": "Technology and human responsibility for a sustainable and equitable world.",
                    "mission": "To advance the understanding of the social and ethical implications of technology among student engineers, researchers, and society at large through open discourse, rigorous research, and human-centric engineering.",
                    "vision": "A world where emerging technologies are ethically developed, universally accessible, and actively deployed to solve pressing social, environmental, and humanitarian challenges.",
                    "corePhilosophy": "SSIT's core philosophy has become the inspirational tag-line for the IEEE organization as a whole: 'Advancing Technology for Humanity'.",
                    "keyTenets": [
                        "Technology is a fundamental resource for human development.",
                        "Technology has intended and unintended consequences that must be anticipated.",
                        "Technology can and must be harnessed for the good of humanity and the planet.",
                    ],
                    "officialEmail": "ieeessitsb@ssn.edu.in",
                    "location": "SSN College of Engineering, Rajiv Gandhi Salai (OMR), Kalavakkam, Chennai 603110",
                    "chairName": "Varun Sudheer",
                    "chairEmail": "varun2410158@ssn.edu.in",
                    "socialLinks": {
                        "instagram": "https://instagram.com/ieee_ssit_ssn",
                        "linkedin": "https://linkedin.com/company/ssn-ieee-ssit",
                        "github": "https://github.com/PranavVasudevan/IEEE-SSIT",
                    },
                    "focusAreas": [
                        {
                            "title": "Environmental Impacts & Sustainability",
                            "desc": "Investigating the carbon footprint of compute clusters, life-cycle assessments of electronic waste, renewable micro-grids, and technological pathways to mitigate global climate disruption.",
                            "contactName": "Dr. K. S. Vijay",
                            "contactEmail": "vijay.env@ssn.edu.in",
                            "accent": "gold",
                        },
                        {
                            "title": "Universal Access to Technology",
                            "desc": "Addressing the digital divide by engineering low-cost, open-source educational hardware, assistive technologies for disabilities, and resilient rural connectivity solutions.",
                            "contactName": "Prof. S. Geetha",
                            "contactEmail": "geetha.access@ssn.edu.in",
                            "accent": "navy",
                        },
                        {
                            "title": "Ethics & Human Rights in AI",
                            "desc": "Interrogating bias in machine learning models, biometric surveillance risks, privacy-preserving cryptography, and the socio-legal accountability frameworks governing algorithmic decision systems.",
                            "contactName": "Dr. M. Arvind",
                            "contactEmail": "arvind.ethics@ssn.edu.in",
                            "accent": "ink",
                        },
                    ],
                }
            )
            db.add(chapter_info)
            db.commit()

        if not db.query(ChapterSetting).filter(ChapterSetting.key == "membership_content").first():
            logger.info("Seeding membership_content setting...")
            membership_content = ChapterSetting(
                key="membership_content",
                value={
                    "joinPortalUrl": "https://www.ieee.org/membership/join/index.html",
                    "steps": [
                        {
                            "step": "01",
                            "title": "Join IEEE as a Student Member",
                            "desc": "Navigate to the official IEEE portal (ieee.org/join). Select Student Membership to avail the 50% global student discount.",
                            "linkText": "IEEE Student Portal ↗",
                            "linkUrl": "https://www.ieee.org/membership/join/index.html",
                        },
                        {
                            "step": "02",
                            "title": "Add SSIT Society Membership",
                            "desc": "During society selection in IEEE cart, search for 'Society on Social Implications of Technology' (SSIT) and add to membership.",
                        },
                        {
                            "step": "03",
                            "title": "Register with SSN Student Branch Chapter",
                            "desc": "Submit your IEEE Member Number via our Contact form to be formally inducted into the SSN SSIT Chapter roster and project teams.",
                            "linkText": "Submit Chapter Intake →",
                            "linkUrl": "/contact",
                        },
                    ],
                    "benefits": [
                        {
                            "title": "IEEE Technology & Society Magazine",
                            "desc": "Complimentary digital subscription to the award-winning peer-reviewed IEEE T&S quarterly journal.",
                        },
                        {
                            "title": "ISTAS Global Conference Discounts",
                            "desc": "Substantial author & attendee discounts for the flagship IEEE International Symposium on Technology and Society.",
                        },
                        {
                            "title": "Leadership & Chapter Governance",
                            "desc": "Executive committee positions, conference chairing, and mentoring junior engineers in technical projects.",
                        },
                        {
                            "title": "Global Professional Network",
                            "desc": "Connect directly with ethicists, policy makers, technologists, and researchers across all IEEE regions.",
                        },
                    ],
                    "faqs": [
                        {
                            "id": "faq-1",
                            "question": "Who is eligible to join the IEEE SSIT SSN Chapter?",
                            "answer": "All undergraduate, postgraduate, and research scholars across all departments (CSE, IT, ECE, EEE, Mech, Civil, BME, Chem) of SSN College of Engineering are warmly invited.",
                            "active": True,
                            "order": 1,
                        },
                        {
                            "id": "faq-2",
                            "question": "Do I need to be from an engineering background?",
                            "answer": "No! SSIT investigates the intersection of tech, ethics, law, and human rights. Multidisciplinary perspectives from mathematics, humanities, and design are vital.",
                            "active": True,
                            "order": 2,
                        },
                        {
                            "id": "faq-3",
                            "question": "How can I join the Web Development / Technical Team?",
                            "answer": "Submit your interest via the Contact page or talk directly to our Web Dev team leads during our annual recruitment drives!",
                            "active": True,
                            "order": 3,
                        },
                    ],
                }
            )
            db.add(membership_content)
            db.commit()

        # 6. SEED ADMIN USERS
        for email in DEFAULT_ADMIN_EMAILS:
            if not db.query(AdminUser).filter(AdminUser.email == email).first():
                admin = AdminUser(
                    id=f"admin-{email.split('@')[0]}",
                    email=email,
                    added_by="Core System Config",
                    active=True,
                )
                db.add(admin)
        db.commit()
        logger.info("Database seeding completed successfully.")

    except Exception as e:
        logger.error(f"Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
