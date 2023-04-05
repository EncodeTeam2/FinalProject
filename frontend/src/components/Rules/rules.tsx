import * as React from 'react';
import { Alert } from 'react-bootstrap';



export default function Rules() {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }} >
            <>
                <Alert variant="success">
                    <Alert.Heading>About</Alert.Heading>
                    Snake game where players stake bets and winner takes pot.
                    <br />
                    The playing ticket value is 0.1 MATIC.
                    <br />
                    Extra MATIC  needed for paying tx fees.
                    <br />
                    <hr />
                    <Alert.Heading>Rules</Alert.Heading>
                    <p>
                        1. Connect your wallet funded with Mumbai MATIC.
                        <br />
                        2. Hit play button and try to get the highest score before time is up.
                        <br />
                        3. After playing, you can submit your score to become the winner.
                        <br />
                        4. When time is up, pot must be claimed.
                        <br />
                        5. Once the pot has been claimed, new game will be available.

                    </p>
                    <hr />
                    <Alert.Heading>Constraints</Alert.Heading>
                    You won't be able to play nor submit your score if time is up.
                    <br />
                    There's a grace period for the winner.
                    <br />
                    Once the grace period is over, anyone will be able to claim the pot.
                    <br />
                    <hr />
                    <Alert.Heading>Be Careful</Alert.Heading>
                    Be sure you will be able to submit your score before the current game is ended.
                    <p className="mb-0">

                    </p>
                </Alert>
            </>
        </div >
    );
}