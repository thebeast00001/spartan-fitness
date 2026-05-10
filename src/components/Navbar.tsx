"use client";

import Link from "next/link";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "Create Your Workout", href: "/schedule" },
    { name: "Programs", href: "/#programs" },
    { name: "Book a Free Trial", href: "/trial" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>SPARTAN / CULTURE</Link>
      
      <div className={styles.navLinks}>
        {links.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className={`${styles.navLink} ${link.name === "Free Trial" ? styles.trialBtn : ""}`}
          >
            <span className={styles.linkText}>{link.name}</span>
            <span className={styles.linkHover}>{link.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
