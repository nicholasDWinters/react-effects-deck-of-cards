import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Deck.css';

const Deck = () => {
    const [numCards, setNumCards] = useState(52);
    const [card, setCard] = useState('');
    const [deckId, setDeckId] = useState('');
    const [isDrawing, setIsDrawing] = useState(false);
    const timerId = useRef();
    useEffect(() => {
        async function loadDeck() {
            try {
                const res = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
                setDeckId(res.data.deck_id);

            } catch (e) {
                console.log(e);
            }
        }
        loadDeck();

    }, []);


    // async function drawCard(deckId) {
    //     try {
    //         if (numCards === 0) throw new Error('No cards remaining!');

    //         const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);

    //         setCard(res.data.cards[0].image);
    //         setNumCards(res.data.remaining);
    //     } catch (e) {
    //         alert(e);
    //     }
    // }

    function startDrawing() {
        setIsDrawing(true);
        timerId.current = setInterval(() => {
            drawCards();

        }, 1000);
    }

    function stopDrawing() {
        setIsDrawing(false);
        clearInterval(timerId.current);
    }

    async function shuffleDeck(id) {
        stopDrawing();
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/shuffle/`);
        setDeckId(res.data.deck_id);
        setCard('');
        setNumCards(52);
    }

    async function drawCards() {
        try {

            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
            if (res.data.remaining === 0) {
                setNumCards(0);
                stopDrawing();
                throw new Error('No cards remaining');
            }
            setCard(res.data.cards[0].image);
            setNumCards(res.data.remaining);

        } catch (e) {
            alert(e);
        }

    }

    return (
        // <div className='Deck'>
        //     {card === '' ? '' : <img className='Deck-img' src={card} alt='card'></img>}
        //     <button className='Deck-btn' onClick={() => drawCard(deckId)}>Draw Card</button>
        //     <p>Cards Remaining: {numCards}</p>

        // </div>
        <div className='Deck'>
            {card === '' ? '' : <img className='Deck-img' src={card} alt='card'></img>}
            <button className='Deck-btn' onClick={isDrawing ? stopDrawing : startDrawing}>{isDrawing ? 'Stop Drawing' : 'Start Drawing'}</button>
            <p>Cards Remaining: {numCards}</p>
            <button onClick={() => shuffleDeck(deckId)}>Shuffle</button>
        </div>
    )
}

export default Deck;