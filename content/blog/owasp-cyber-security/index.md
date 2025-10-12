---
date: 2023-02-15
title: "Security, OWASP and Wawandco"
draft: false
type: post
description: Data breaches and cyber-attacks are a menace to the integrity of the businesses that operate on the web. Learn more about the largest security-oriented project there is and how we at Wawandco care for the security of our systems.

summary: With the rise of cyber-attacks and data breaches, ensuring the security of applications has become a critical concern for businesses on the web and their users. Learn more about OWASP and how we care about security at Wawandco.

author: "@Wawandco"
tags: ["software-development"]
blogimage: "/images/meta/posts/OWASP-blog.png"
---

With the rise of cyber-attacks and data breaches, ensuring the security of applications has become a critical concern for businesses on the web and their users. With more people working from home and accessing sensitive data remotely, there is a greater risk of data breaches and cyber-attacks. At the same time, the widespread adoption of technology has increased the volume and value of stored and processed data, making it even more critical to protect.

Additionally, regulations like the European Union's General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA) have increased security breaches' legal and financial consequences. As a result, ensuring the security of applications and data has become a top priority for software companies which must adopt best practices for securing applications and protecting sensitive data.

## Open Web Application Security Project (OWASP)
[OWASP](https://owasp.org/about/) is one of the most recognized projects for application security. This project is part of the OWASP Foundation, an open community made by corporations, foundations, developers, and volunteers that provides projects, documents, and resources to help people improve their knowledge regarding application security and for people to develop and maintain safe applications.

OWASP’s mission is to have no more insecure applications and focus its efforts on providing educational resources and hosting events to nurture the importance of AppSec and how to uphold it.

Another project from the OWASP Foundation worthy of a callout is the [Top 10 Project](https://owasp.org/www-project-top-ten/). This project highlights the most common web application security risks observed over four years and some intel collected through community surveys.

The OWASP Top 10 provides a baseline for organizations to assess the security of their web applications and prioritize mitigation efforts. By focusing on these commonly exploited weaknesses, organizations can significantly improve their AppSec and reduce the risk of a successful attack.

Additionally, the OWASP Foundation provides a standard known as the [Application Security Verification](https://owasp.org/www-project-application-security-verification-standard/), which provides comprehensive guidelines and practices for testing the security of web applications.

There’s also a project called Cheat Sheet Series that holds a set of simple practices you can apply in terms of application security. This one is useful if you’re looking for more practical things to start implementing.

## Application Security Practices at Wawandco
OWASP helps us gain more insight regarding our current status of application security and the things we can do to augment, but how does that translate into practical terms? 
At Wawandco, we apply the following practices based on the intel provided by OWASP:

- **We incorporate security in software development life cycle**: Security is considered a vital part of the software development process and is embodied in the application’s design and architecture, as well as security testing and code review.

- **Developers receive security training**: Regular training on secure coding practices and the latest security threats can help prevent the introduction of vulnerabilities into the codebase.

- **Our teams conduct security assessments**: Regular security assessments, such as penetration testing and vulnerability scanning, help promptly identify and address security weaknesses.

- **We adopt industry-standard security practices**: Adopting security standards like OWASP *Application Verification Standard* can help ensure that applications are built and tested with security in mind.

- **Our teams use secure communication channels**: All communication channels, including those between the development team and clients, should be protected and encrypted.

- **We keep software up-to-date**: The latest security patches and upgrades should be kept up-to-date to reduce the risk of exploits.

There are also several tools available to help validate secure coding practices; our teams use some of these:

- **Static Code Analysis Tools**: These tools analyze the source code without executing it, looking for potential security vulnerabilities and code-level issues. Examples include [SonarQube](https://www.sonarsource.com/products/sonarqube/), [Fortify](https://www.microfocus.com/en-us/cyberres/application-security), and [Checkmarx](https://checkmarx.com/).

- **Dynamic Application Security Testing (DAST) Tools**: These tools test the application by sending requests and analyzing the responses. Examples include [OWASP ZAP](https://www.zaproxy.org/) and [WebInspect](https://www.microfocus.com/en-us/cyberres/application-security/webinspect).

- **Interactive Application Security Testing (IAST) Tools**: These tools integrate with the application during runtime, analyzing it for vulnerabilities in real-time. Examples include [AppScan](https://www.hcltechsw.com/appscan) and [Veracode](https://www.veracode.com/).


## Closing thoughts
Security should be a priority for businesses operating on the Web if they want to build customer trust. Following the aforementioned practices will help software companies provide safe applications to gain their users’ trust and protect their most valuable asset, the data they manage through their systems.


