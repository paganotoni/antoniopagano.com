---
date: 2023-02-08
title: "Get to Know DORA Metrics: The Key to DevOps Success"
draft: false
type: post
description: Knowing how well a team performs can open the door to improvements to the current development process. DORA Metrics allowed us to know more about the characteristics that make a high-performing team and can help us visualize how well our team is doing in terms of performance.

summary: In today's fast-paced software development world, measuring team performance is crucial for improvement. DORA metrics help transform low-performing teams into high-performing ones. They track progress and ensure customer value delivery.

author: "@paganotoni"
tags: ["devops", "performance", "teams", "software-development", "management", "monitoring"]
---

In today's fast-paced software development world, measuring the performance and progress of a team is crucial. Knowing how well a team performs can open the door to improvements to the current development process. Improvements that will take them from being a low-performing team to a high-performing one. Metrics are just a way for teams to track their progress and ensure they deliver customer value.

## Story Points
One of the most common approaches we’ve seen in companies is using Story Points to measure performance. However, while this might look like a standard practice, it has the following shortcomings:

#### Subjectivity
Story Points are based on the relative estimation of effort required to complete a user story, and this estimation is subjective. It depends on the team's understanding and experience, which can lead to inconsistencies and inaccuracies.

#### Difficulty in comparison
Story Points are a relative measurement; comparing the performance of two teams or projects that use different scales for Story Points can be challenging.

#### Limited scope
Story Points focus solely on the effort required to complete a user story and do not consider other factors that impact performance, such as quality, speed, and customer satisfaction.

#### Lack of real-world context
Story Points are an abstraction that may not reflect the real-world effort required to complete a user story. This abstraction can lead to mismatches between estimated and actual action, resulting in inaccurate predictions and planning.

#### Limited ability to track progress
Story Points do not provide a clear view of progress over time, and teams may need to use additional metrics to track their performance accurately.

While Story Points can help estimate the effort required to complete a user story, they have limitations when measuring performance. From the frustrations of Story Points performance analysis, we’ve seen how some companies start to build metrics. Why?

## Enter DORA Metrics
DORA (DevOps Research and Assessment) Metrics were developed by Dr. Nicole Forsgren, Jez Humble, and Gene Kim, leading experts in the field of DevOps. They created the DORA Metrics through a combination of research and practical experience working with organizations to implement DevOps practices.

The DORA Metrics were first introduced in the book "Accelerate: The Science of Lean Software and DevOps: Building and Scaling High-Performing Technology Organizations" by Forsgren, Humble, and Kim. The book provides a comprehensive overview of the DORA Metrics framework and its research and offers practical guidance for organizations looking to implement DevOps practices.

Since its introduction, DORA Metrics have become widely adopted by organizations of all sizes to measure the performance of their DevOps practices. The DORA Metrics framework continues to evolve and expand based on the latest research and best practices in the field of DevOps.

### Key Metrics
The DORA Metrics framework consists of four key metrics:

#### Deployment Frequency
This measures the number of deployments to production per day, week, or month. It reflects the organization's ability to quickly and frequently deploy code changes to production.

#### Lead Time for Changes
This measures the time it takes from when a change is committed to when it is deployed to production. It provides insight into the speed and efficiency of the organization's software delivery pipeline.

#### Time to Restore Service
This measures the time it takes to restore service after an incident occurs. It reflects the organization's ability to resolve issues and restore service to its customers quickly.

#### Change Failure Rate
This measures the number of changes that fail during the deployment process and have to be rolled back or fixed. It provides insight into the quality and reliability of the organization's software delivery pipeline.

By tracking these four key metrics, organizations can gain a comprehensive view of their DevOps practices and identify areas for improvement. DORA Metrics are helpful for organizations of all sizes, from small startups to large enterprises, and can help teams make data-driven decisions to continuously improve their software development process.

## Which one to choose?
So, which is better, DORA Metrics or Story Points? The answer is it depends. While both DORA Metrics and Story Points have their strengths and weaknesses, each serves a different purpose.

DORA Metrics is more focused on measuring the performance of the entire DevOps process, from code changes to production deployment. As a result, it provides a holistic view of an organization's DevOps practices and helps teams identify areas for improvement. On the other hand, Story Points are more focused on estimating the effort required to complete a specific user story and are used for sprint planning and prioritization.

Another critical difference between DORA Metrics and Story Points is the level of granularity. DORA Metrics provides a high-level view of an organization's DevOps practices, while Story Points provides a detailed picture of a specific user story.

## How to use DORA Metrics

At our company, we use DORA Metrics to measure the performance of our DevOps practices and identify areas for improvement. We use the following process to measure our performance:

- We use Swarmia or LinearB to track our DORA Metrics.
- Our teams are fluent in the DORA Metrics and understand how to use them to measure their performance.
- Our communication channels benefit from the data processing of tools like LinearB or Swarmia.
- We incorporate DORA Metrics into our daily standups and sprint planning meetings.
- Team retrospectives usually include discussion of DORA Metrics and how the team performed.

This can be a bit overwhelming at first, but it's important to remember that DORA Metrics are just a tool to help teams measure their performance and identify areas for improvement. They are not a replacement for the team's experience and expertise.

One key area where we've seen it has been particularly useful is when validating process changes. For example, if a team wants to change their deployment process, they can use DORA Metrics to measure the impact of the change on their deployment frequency and lead time for changes. This helps them understand the impact of the change and make data-driven decisions to improve their DevOps practices.

This has proven to be a very effective way to measure the performance of our DevOps practices and identify areas for improvement. We've seen that it helps teams make data-driven decisions and continuously improve their software development process.

## Closing thoughts
In conclusion, DORA Metrics and Story Points have unique strengths and weaknesses and serve different purposes. Organizations should use both metrics to understand their software development process and make data-driven decisions comprehensively. By using DORA Metrics to measure the performance of their DevOps practices and Story Points to estimate the effort required to complete user stories, organizations can ensure they are delivering value to the customer and continuously improving their software development process.

## Further Reading
- [What are DORA (DevOps Research and Assessments) Metrics?](https://www.splunk.com/en_us/data-insider/devops-research-and-assessment-metrics.html)
- [What are DORA Metrics and How Do They Improve Dev Teams?](https://linearb.io/blog/dora-metrics/)
- [Practical guide to DORA metrics](https://www.swarmia.com/blog/dora-metrics/)
- [Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339)
- [DORA's research program](https://www.devops-research.com/research.html)
- [The DORA DevOps Metrics – Everything You Need to Know](https://www.propelo.ai/blog/2022/dora-devops-metrics)
- [What are DORA Metrics and Why Do They Matter?](https://codeclimate.com/blog/dora-metrics/)
- [Use Four Keys metrics like change failure rate to measure your DevOps performance](https://cloud.google.com/blog/products/devops-sre/using-the-four-keys-to-measure-your-devops-performance)
