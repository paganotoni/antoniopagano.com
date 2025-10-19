---
date: 2025-07-19
title: "When Logic Fails: How We Settled the Monty Hall Problem with Go"

draft: false
type: post
description: When our team couldn't agree on the Monty Hall problem, we turned to Go programming to settle the debate. This article shows how we built a simulation to prove that switching doors really does double your chances of winning.

summary: When our team couldn't agree on the Monty Hall problem, we turned to Go programming to settle the debate. This article shows how we built a simulation to prove that switching doors really does double your chances of winning.

author: "@paganotoni"
tags: ["go", "golang", "probability", "simulation", "monty-hall", "mathematics", "tutorial"]
---

Have you ever found yourself in a heated debate where everyone *knows* they're right, but nobody can prove it? That's exactly what happened to our team when the Monty Hall problem came up during a casual lunch discussion.

## The Great Debate

It started innocently enough. Someone mentioned the classic game show scenario: you're presented with three doors, behind one is a car, behind the others are goats. You pick a door, then the host (who knows what's behind each door) opens one of the remaining doors to reveal a goat. The host then asks: "Do you want to switch to the other unopened door?"

The room immediately split into two camps:

**Team "It Doesn't Matter"**: "It's 50/50 now, switching makes no difference!"

**Team "Always Switch"**: "No way, switching doubles your chances!"

After an hour of increasingly animated discussion, drawing diagrams on whiteboards, and nobody budging from their position, we realized we needed a different approach. The theoretical explanations weren't convincing anyone who wasn't already convinced.

## When in Doubt, Simulate

That's when someone suggested: "Why don't we just run it a bunch of times and see what actually happens?"

We decided to settle this once and for all with code. Go was our language of choice for this experiment – it's fast, concurrent, and perfect for running thousands of simulations quickly.

## Building the Simulation

Our approach was straightforward:

1. **Set up the game**: Randomly place the car behind one of three doors
2. **Make the first choice**: Randomly pick a door
3. **Decide whether to switch**: Randomly choose to switch or stay
4. **Determine the outcome**: Did we win or lose?
5. **Repeat thousands of times**: Let the numbers speak for themselves

Here's the core of our simulation:

{{<copyable-code language="go">}}
type simulation struct {
    winBucket    int
    firstPick    int
    userSwitched bool
    userWon      bool
    buckets      [3]bool
}

func RunSimulation() simulation {
    run := simulation{
        winBucket:    rand.Intn(3),
        firstPick:    rand.Intn(3),
        userSwitched: rand.Intn(2) == 1,
        buckets:      [3]bool{},
    }

    run.buckets[run.winBucket] = true

    if !run.userSwitched {
        run.userWon = run.firstPick == run.winBucket
        return run
    }

    // Handle switching logic
    pending := []int{}
    for i := range 3 {
        if i == run.firstPick {
            continue
        }
        pending = append(pending, i)
    }

    switched := pending[rand.Intn(len(pending))]
    run.userWon = switched == run.winBucket

    return run
}
{{</copyable-code>}}

## The Moment of Truth

We ran our simulation with thousands of iterations, each one playing out the scenario randomly. The results were printing out in real-time:

```
#0 - Switched: true - Winner: false
#1 - Switched: false - Winner: false
#2 - Switched: false - Winner: false
#3 - Switched: false - Winner: true
#4 - Switched: true - Winner: false
...
```

As the results poured in, we started seeing a clear pattern emerge. The "Always Switch" team began smiling while the "It Doesn't Matter" team grew quieter.

## The Verdict

After running thousands of simulations, the numbers were undeniable:

- **Switching strategy**: ~66% win rate
- **Staying strategy**: ~33% win rate

The simulation confirmed what probability theory had been trying to tell us all along: **switching really does double your chances of winning**.

## Why This Actually Makes Sense

Now that we've seen the numbers, let's talk about why switching really does give you better odds. The explanation is actually quite elegant once you think about it the right way.

When you make your initial choice, you have a 1 in 3 chance of picking the car. That's pretty straightforward – there are three doors, one has the car, so you've got a 33% shot.

```
Initial Setup:
┌─────┐  ┌─────┐  ┌─────┐
│  1  │  │  2  │  │  3  │
│     │  │ 🚗  │  │     │
│ 🐐  │  │     │  │ 🐐  │
└─────┘  └─────┘  └─────┘
   ↑
You pick Door 1
Probability: 1/3 (33%)
```

But here's the key insight: that means there's a 2 in 3 chance (67%) that the car is behind one of the *other* two doors. This is where it gets interesting.

```
Probability Distribution:
┌─────┐  ┌─────────────────┐
│  1  │  │    Doors 2&3    │
│     │  │                 │
│ 1/3 │  │      2/3        │
│ 33% │  │      67%        │
└─────┘  └─────────────────┘
```

When the host opens one of those other doors to reveal a goat, they're not changing the fundamental probability of your original choice. Your door still has that same 1 in 3 chance of having the car. But remember that 2 in 3 chance that the car was behind one of the other doors? That probability doesn't just vanish into thin air.

```
Host Opens Door 3 (Always a Goat):
┌─────┐  ┌─────┐  ┌─────┐
│  1  │  │  2  │  │  3  │
│     │  │ 🚗  │  │     │
│ 🐐  │  │     │  │ 🐐  │ ← Host reveals
└─────┘  └─────┘  └─────┘
   ↑                 ╳

Your door: still 1/3
The 2/3 probability now concentrates on Door 2!
```

Since the host always reveals a goat (they know where the car is), that 2 in 3 probability gets concentrated entirely on the one remaining unopened door. So when you switch, you're not just getting a 50/50 coin flip – you're getting access to that original 2 in 3 probability.

```
Final State - Stay vs Switch:
┌─────┐  ┌──────┐
│  1  │  │  2   │
│STAY │  │SWITCH│
│ 1/3 │  │  2/3 │
│ 33% │  │  67% │
└─────┘  └──────┘
```

Think of it this way: imagine if there were 100 doors instead of 3. You pick one door (1% chance of winning), then the host opens 98 doors with goats, leaving just one other door closed. Would you switch? Of course! Your original door still has that tiny 1% chance, but the remaining door now represents the other 99% chance.

```
The 100-Door Version:
Your door: [1] → 1% chance
Host opens: [2][3][4]...[99] → All goats
Remaining: [100] → 99% chance

Obviously switch to door 100!
```

The Monty Hall problem is the same principle, just with smaller numbers that make our intuition play tricks on us.

## Why This Matters

This experience taught us something valuable beyond just the Monty Hall problem. Sometimes when logic and intuition clash, and theoretical explanations aren't cutting through, empirical evidence can be the great equalizer.

The beauty of simulation is that it strips away all the confusing explanations and lets the raw numbers tell the story. No more arguing about conditional probabilities or drawing complex tree diagrams – just run the code and see what happens.

## The Takeaway

The next time your team gets stuck debating something that can be tested, consider reaching for code instead of more PowerPoint slides. A simple simulation in Go (or any language) might just be the fastest path to consensus.

And yes, we all learned to always switch doors in game shows. Though to be honest, most of us are still a little surprised by those results, even after seeing them with our own eyes.
