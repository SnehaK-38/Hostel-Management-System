import "./HomeAbout.css";

const HomeAbout = () => {
  return (
    <div className="home-about">
      {/* Text Section */}
      <div className="home-about-content">
        <h1 className="home-about-title">ABOUT</h1>
        <p className="home-about-text">
          Shah and Anchor Kutchhi Engineering College was established in 1985 for the purpose of imparting quality technical education. The college is managed by Mahavir Education Trust. The college is approved by AICTE, New Delhi and Government of Maharashtra, and is affiliated to University of Mumbai. It also has an ISO 9001:2015 Certification. It offers under graduate courses in Computer Engineering, Information Technology, Electronics and Computer Science,Electronics & Telecommunication, Artificial Intelligence & Data Science, Cyber Security, VLSI Design & Technology and Advance Communication Technology. It also offers Post Graduate Courses in Computer Engineering, Information Technology & Electronics Engineering.
        </p>
        <p className="home-about-text">
          Education is a lifelong learning process which meets a variety of needs across industries, businesses and communities. It includes skills training or upgrading of skills and acquiring knowledge through competency based education. We live in a world where everything is changing. However, there are two things which are a constant, change and the process of learning. In this everchanging and evergrowing industrial world, education is required for everyone to stay current with the latest trends, developments, skills, and new technologies required in various fields. We offer students myriad experiences and also encourage them to participate in various activities to help them build a thought process, independent of apprehensions and one that develops a sensitivity within themselves.
        </p>
        <p className="home-about-text">
          We, at Shah & Anchor Kutchhi Engineering College, cherish a mission of achieving our goal of imparting state of art technical and management education in the emerging disciplines. We fulfill our commitment through periodic review of our academic environment and management system, and continual improvement of infrastructure, teaching techniques and faculty skills to keep pace with the latest developments. While doing so, we ensure compliance with the applicable rules, regulations and statutory requirements in force for the self-financed minority education institution.
        </p>
        <p className="home-about-text">
          Mahavir Education Trust’s SAKEC stands on the cusp of completing four decades since it was founded in 1985. Since its inception, SAKEC has been committed to foster in its students, the pursuits of individual excellence and encourage participation in various academic, cultural, social and physical activities.
        </p>
        <p className="home-about-text">
          SAKEC has developed a lean administrative structure to keep us nimble enough to leverage exciting opportunities and promote innovations. As we consolidate our experiences from our eventful decades, our narrative has been that of innovation and disruption. We expect that the lessons we learnt along the way will fuel and lay the foundation of the next phase of our growth. SAKEC is building the next generation of movers, thinkers and innovators. Our alumni are blazing new paths in entrepreneurship and research around the globe.
        </p>
        <p className="home-about-text no-display-text">
          Education is a lifelong learning process which meets a variety of needs across industries, businesses and communities. It includes skills training or upgrading of skills and acquiring knowledge through competency based education. We live in a world where everything is changing. However, there are two things which are a constant, change and the process of learning. In this everchanging and evergrowing industrial world, education is required for everyone to stay current with the latest trends, developments, skills, and new technologies required in various fields. We offer students myriad experiences and also encourage them to participate in various activities to help them build a thought process, independent of apprehensions and one that develops a sensitivity within themselves. At SAKEC the content and the teaching methodologies used are structured in such a fashion that it gives practical exposure to the students. As may be appreciated, a thorough insight into the inter-dependent features of multi-layered teaching and learning process is a sine qua non to understand the emerging dynamics of the varied modes of engineering education and to optimize opportunities. I wholeheartedly welcome you to SAKEC, a unique institution of specialized pedagogy in the amazing world of engineering education.
        </p>
        <p className="home-about-text no-display-text">
          Our Inspiration<br/>
          Shri Keshavjibhai Umarshibhai Chhadva<br/>
          His life's journey is an example of how hardships can mould a great personality and in turn, bring benefit to society at large. A great visionary, he had devoted his entire life to the cause of education and social work. Under Bhavna trust and Mahavir Education trust, he founded many Schools, Junior colleges, Polytechnics and Engineering colleges.
        </p>
      </div>

      {/* Map Section */}
      <div className="home-about-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.843152641848!2d72.90681931534147!3d19.04850648662861!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6d8323d362b%3A0x5fcb9f0db91ec0a2!2sShah%20%26%20Anchor%20Kutchhi%20Engineering%20College!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
  title="college-map"
  width="600"
  height="450"
  style={{ border: "0", borderRadius: "10px" }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default HomeAbout;
