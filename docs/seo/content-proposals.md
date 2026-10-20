# Proposed text changes — needs client approval

Nothing in this file is on the website. Finixsoft decided on 2026-10-19 to make only
technical SEO changes and to put any new visible text here first. Approve, edit or reject each
item. Once approved, it goes into `messages/en.json` and `messages/mr.json` (Marathi
translation to be checked by the client).

## 1. Answer summaries (40–60 words) under each service heading

Answer engines (Google AI Overviews, voice assistants, ChatGPT search) often quote one short
paragraph that answers "what is this and who is it for". All facts below already appear on
the site.

**Sell Old Gold & Silver**
> Suvarnavarsha Gold buys old gold and silver of any karat at its branch at VTP Altitude, Dange
> Chowk, Pune. Jewellery, coins, bars and broken pieces are tested for purity and weighed in
> front of you. The price is weight × purity × today's rate, and payment is made in about
> 5 minutes by bank transfer or cash within legal limits.

**Release Pledged Gold**
> If your gold is pledged with a bank, NBFC or pawn broker, Suvarnavarsha Gold can help you
> close the gold loan. We pay the lender, the gold is released and tested, and you receive the
> balance after the loan amount is deducted. Bring your loan statement and ID proof to our
> Dange Chowk branch in Pune.

**Buy 24K Gold Coins & Bars**
> Suvarnavarsha Gold sells 24 karat gold coins, bars and biscuits from 0.5 g to 100 g at
> Dange Chowk, Pune. Every piece is BIS Hallmark and HUID certified, and its purity can be
> checked on any testing machine. Stock is limited, so register in advance (free) before you
> visit.

## 2. Question-style headings

Rename some existing section headings to the way people ask. The text under each one stays
the same.

| Page | Current heading (messages key) | Proposed |
| --- | --- | --- |
| Sell Gold | `sell.priceTitle` | How is the price of old gold calculated? |
| Sell Gold | `sell.docsTitle` | What documents do I need to sell gold? |
| Sell Gold | `sell.paymentTitle` | How will I be paid? |
| Release Pledged Gold | documents heading | What documents are needed to release pledged gold? |
| Buy Gold | hallmark heading | Are the coins and bars BIS hallmarked? |

## 3. FAQs to add (in /admin → FAQs)

Answer only once the client has confirmed each fact.

- Where can I sell old gold near Wakad or Hinjewadi? (The branch is at Dange Chowk; give
  directions.)
- What are your opening hours? **[CLIENT TO PROVIDE: days and hours]**
- Is there a fee for valuation or purity testing? **[confirm "free" — CLAUDE.md 8.1]**
- What testing method do you use? (German-technology machine; name it XRF only if it is one)
- Do I need a PAN card for large amounts? **[client's CA to confirm, CLAUDE.md 8.2]**
- Is Suvarnavarsha the same as "Swarnvarsha"? (Only if the client confirms customers use that
  spelling.)

## 4. "Last updated" date on service pages

Show "Last updated: <date>" on the service pages. The pages are written in code, not in the
CMS, so the date would be set by hand whenever the text changes. Approve or skip.
