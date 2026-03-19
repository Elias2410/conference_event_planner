import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";

const ConferenceEvent = () => {

    // ===================== STATE =====================
    const [showItems, setShowItems] = useState(false);
    const [numberOfPeople, setNumberOfPeople] = useState(1);

    // ===================== REDUX =====================
    const venueItems = useSelector((state) => state.venue);
    const avItems = useSelector((state) => state.av);
    const mealsItems = useSelector((state)=> state.meals)
    const dispatch = useDispatch();

    // ===================== DERIVED VALUES =====================
    const remainingAuditoriumQuantity =
        3 - venueItems.find(item => item.name === "Auditorium Hall (Capacity:200)").quantity;

    // ===================== HANDLERS =====================
    const handleToggleItems = () => {
        console.log("handleToggleItems called");
        setShowItems(!showItems);
    };

    const handleAddToCart = (index) => {
        if (
            venueItems[index].name === "Auditorium Hall (Capacity:200)" &&
            venueItems[index].quantity >= 3
        ) {
            return;
        }
        dispatch(incrementQuantity(index));
    };

    const handleRemoveFromCart = (index) => {
        if (venueItems[index].quantity > 0) {
            dispatch(decrementQuantity(index));
        }
    };

    const handleIncrementAvQuantity = (index) => {
        dispatch(incrementAvQuantity(index))
    };

    const handleDecrementAvQuantity = (index) => {
        dispatch(decrementAvQuantity(index))
    };

    const handleMealSelection = (index) => {
        dispatch(toggleMealSelection(index))
    };

    const navigateToProducts = (idType) => {
        if (idType == '#venue' || idType == '#addons' || idType == '#meals') {
            if (showItems) {
                setShowItems(!showItems);
            }
        }
    };

    // ===================== HELPERS =====================
    const getItemsFromTotalCost = () => {
        const items = [];
    };

    const calculateTotalCost = (section) => {
        let totalCost = 0;
        if (section === "venue") {
            venueItems.forEach((item) => {
                totalCost += item.cost * item.quantity;
            });
        }
        if (section === 'av'){
            avItems.forEach((item)=>{
                totalCost += item.cost * item.quantity
            })
        }
        if (section === 'meals'){
            const selectedMeals = mealsItems.filter(item => item.selected === true)
            totalCost = selectedMeals.reduce((sum, item)=> sum + item.cost,0)
            totalCost *= numberOfPeople
        }
        return totalCost;
    };

    // ===================== COMPUTED =====================
    const items = getItemsFromTotalCost();
    const venueTotalCost = calculateTotalCost("venue");
    const avTotalCost = calculateTotalCost("av");
    const mealsCost = calculateTotalCost('meals');

    // ===================== SUB COMPONENTS =====================
    const ItemsDisplay = ({ items }) => {};

    // ===================== RENDER =====================
    return (
        <>
            {/* ===================== NAVBAR ===================== */}
            <navbar className="navbar_event_conference">
                <div className="company_logo">Conference Expense Planner</div>

                <div className="left_navbar">
                    <div className="nav_links">
                        <a href="#venue" onClick={() => navigateToProducts("#venue")}>Venue</a>
                        <a href="#addons" onClick={() => navigateToProducts('#addons')}>Add-ons</a>
                        <a href="#meals" onClick={() => navigateToProducts('#meals')}>Meals</a>
                    </div>

                    <button
                        className="details_button"
                        onClick={() => setShowItems(!showItems)}
                    >
                        Show Details
                    </button>
                </div>
            </navbar>

            {/* ===================== MAIN ===================== */}
            <div className="main_container">
                {!showItems ? (
                    <div className="items-information">

                        {/* ===================== VENUE ===================== */}
                        <div id="venue" className="venue_container container_main">
                            <div className="text">
                                <h1>Venue Room Selection</h1>
                            </div>
                            <div className="venue_selection">
                                {venueItems.map((item, index) => (
                                    <div className="venue_main" key={index}>
                                        <div className="img">
                                            <img src={item.img} alt={item.name} />
                                        </div>
                                        <div className="text">{item.name}</div>
                                        <div>${item.cost}</div>
                                        <div className="button_container">
                                            {venueItems[index].name === "Auditorium Hall (Capacity:200)" ? (
                                                <>
                                                    <button
                                                        className={
                                                            venueItems[index].quantity === 0
                                                                ? "btn-warning btn-disabled"
                                                                : "btn-minus btn-warning"
                                                        }
                                                        onClick={() => handleRemoveFromCart(index)}
                                                    >
                                                        &#8211;
                                                    </button>
                                                    <span className="selected_count">
                                                        {venueItems[index].quantity > 0
                                                            ? ` ${venueItems[index].quantity}`
                                                            : "0"}
                                                    </span>
                                                    <button
                                                        className={
                                                            remainingAuditoriumQuantity === 0
                                                                ? "btn-success btn-disabled"
                                                                : "btn-success btn-plus"
                                                        }
                                                        onClick={() => handleAddToCart(index)}
                                                    >
                                                        &#43;
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="button_container">

                                                    <button
                                                        className={
                                                            venueItems[index].quantity === 0
                                                                ? " btn-warning btn-disabled"
                                                                : "btn-warning btn-plus"
                                                        }
                                                        onClick={() => handleRemoveFromCart(index)}
                                                    >
                                                        &#8211;
                                                    </button>

                                                    <span className="selected_count">
                                                        {venueItems[index].quantity > 0
                                                            ? ` ${venueItems[index].quantity}`
                                                            : "0"}
                                                    </span>

                                                    <button
                                                        className={
                                                            venueItems[index].quantity === 10
                                                                ? " btn-success btn-disabled"
                                                                : "btn-success btn-plus"
                                                        }
                                                        onClick={() => handleAddToCart(index)}
                                                    >
                                                        &#43;
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="total_cost">Total Cost: ${venueTotalCost}</div>
                        </div>
                        
                        {/* ===================== ADDONS ===================== */}
                        <div id="addons" className="venue_container container_main">
                            <div className="text">
                                <h1> Add-ons Selection</h1>
                            </div>
                            <div className="addons_selection">
                                {
                                    avItems.map((item, index)=>(
                                        <div className="av_data venue_main" key={index}>
                                            <div className="img">
                                                <img src={item.img} alt={item.name}/>
                                            </div>
                                            <div className='text'>
                                                {item.name}
                                            </div>
                                            <div className='text'>
                                                ${item.cost}
                                            </div>
                                            <div className="addons_btn">
                                                <button 
                                                    className="btn-warning"
                                                    onClick={()=> handleDecrementAvQuantity(index)}
                                                >&ndash;</button>
                                                <span
                                                    className="quantity-value"
                                                >{item.quantity}</span>
                                                <button 
                                                    className="btn-success"
                                                    onClick={()=> handleIncrementAvQuantity(index)}
                                                >&#43;</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="total_cost">Total Cost: ${avTotalCost}</div>
                        </div>

                        {/* ===================== MEALS ===================== */}
                        <div id="meals" className="venue_container container_main">
                            <div className="text">
                                <h1>Meals Selection</h1>
                            </div>
                            <div className="input-container venue_selection">
                                <label htmlFor="numberOfPeople">Number of People:</label>
                                <input
                                    type="number"
                                    className="input_box5"
                                    id="numberOfPeople"
                                    onChange={
                                        (e)=>{
                                            const value = parseInt(e.target.value)
                                            if (isNaN(value) || value < 1){
                                                setNumberOfPeople(1)
                                            } else {
                                                setNumberOfPeople(value)
                                            }
                                        }
                                    }
                                    min='1'
                                />
                            </div>
                            <div className="meal_selection">
                                {
                                    mealsItems.map((item,index)=>(
                                        <div className="meal_item" key={index} style={{ padding: 15 }}>
                                            <div className="inner">
                                                <input
                                                    type="checkbox"
                                                    id={`meal_${index}`}
                                                    checked={item.selected}
                                                    onChange={()=>{handleMealSelection(index)}}
                                                />
                                                <label htmlFor={`meal_${index}`}>{item.name}</label>
                                            </div>
                                            <div className="meal_cost">${item.cost}</div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="total_cost">Total Cost: ${mealsCost}</div>
                        </div>
                    </div>
                ) : (

                    <div className="total_amount_detail">
                        <TotalCost
                            totalCosts={totalCosts}
                            handleClick={handleToggleItems}
                            ItemsDisplay={() => <ItemsDisplay items={items} />}
                        />
                    </div>

                )}
            </div>
        </>
    );
};

export default ConferenceEvent;