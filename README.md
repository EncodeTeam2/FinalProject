# About

dApp built arround a simple game where players stake bets and winner takes pot. That's it. There are no hidden costs nor profit for the owners.

# How to play

1. Connect your wallet with at least 0.2 MATIC.
2. Hit play button and try to beat game current highscore before time is up.
   - You will need to pay for the ticket + tx fees.
   - You won't be able to play if time is up, until someone claims.
3. when you lose, you can opt to submit your score.
   - You will need to pay for the tx fees.
   - You will be able to update your personal highscore and current game highscore to become the winner.
   - You won't be able to submit your score if time is up.
4. When time is up, pot must be claimed.
   - There's a grace period for the winner.
   - Once the grace period is over, anyone will be able to claim the pot.
5. Once the pot has been claimed, the next player will launch a new game and time will start running again.

# Possible issues

- Highest score that is sent from frontend could be manipulated
- Someone can play on the edge of a game and when he tries to submit his score, the game is already closed.

# Technical details

- #### 📜 &nbsp;&nbsp;[Smart Contract](https://github.com/EncodeTeam2/FinalProject/blob/main/blockchain/README.md)
- #### 🎨 &nbsp;&nbsp;[Frontend](https://github.com/EncodeTeam2/FinalProject/blob/main/frontend/README.md)
