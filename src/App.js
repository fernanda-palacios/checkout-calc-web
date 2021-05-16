import React, { useState, useEffect } from 'react';
import './App.css';
// import firebase from './firebase';


function App() {

  // using empty string as default when these are empty
  // main reason bc we are showing default value at the beginning so would show '0' for example
  // but probably better to show nothing
  const [itemName, setItemName] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [quantity, setQuantity] = useState('');

  // values that user is editing but hasn't yet applied
  const [newTaxPercentage, setNewTaxPercentage] = useState('');
  const [newDiscountPercentage, setNewDiscountPercentage] = useState('');

  // actual applied/saved values (these would come from the back-end)
  const [savedTaxPercentage, setSavedTaxPercentage] = useState(0);
  const [savedDiscountPercentage, setSavedDiscountPercentage] = useState(0);

  const [allItems, setAllItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)


  // fetch all data in firestore checkoutCalculator table and store it to local state.
  // useEffect(() => {
  //   const fetchData = async () => {
  //     await firebase.firestore().collection("checkoutCalculator").get().then(
  //       function (querySnapShot) {
  //         const data = {};
  //         querySnapShot.forEach(function (doc) {
  //           data[doc.id] = doc.data();
  //         });
  //         //only data with id 1 exist.
  //         const dataId = 1;
  //         setAllItems(data[dataId].items);
  //         setSavedDiscountPercentage(data[dataId].discount_percentage);
  //         setSavedTaxPercentage(data[dataId].tax_percentage);
  //       }
  //     );
  //   };
  //   fetchData();
  //   calculateTotal();
  // }, []);

  useEffect(() => {
    calculateTotal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedTaxPercentage, savedDiscountPercentage, allItems]);

  // If data already exists, it updates the values on data. Otherwise, it creates the new data
  const updateFirestoreData = (items, discountPercentage, taxPercentage) => {
    // firebase.firestore().collection("checkoutCalculator").doc('1').set({
    //   items: items,
    //   discount_percentage: discountPercentage,
    //   tax_percentage: taxPercentage,
    // }).then(function () {
    //   console.log("data updated successfully");
    // })
  };


  const calculateTotal = () => {
    let subtotal = 0
    allItems.forEach((item) => {
      let itemTotal
      if (isNaN(item.pricePerUnit) || isNaN(item.quantity)) {
        itemTotal = 0
      }
      else {
        itemTotal = item.pricePerUnit * item.quantity
      }
      // const itemTotal = item.pricePerUnit * item.quantity
      subtotal += itemTotal
    })

    const tax = subtotal * (savedTaxPercentage / 100)
    const discount = subtotal * (savedDiscountPercentage / 100)
    const total = subtotal + tax - discount

    setSubtotal(subtotal)
    setTotal(total)
  }



  return (
    <>
      <div style={{ marginLeft: '30px' }}>
        <h2>Add Item</h2>

        <p>
          <span style={{ marginRight: '10px' }}>Item name:</span>
          <input type="text" onChange={(e) => setItemName(e.target.value)} value={itemName} style={{padding: '3px'}}/>
        </p>

        <p>
          <span style={{ marginRight: '10px' }}>Price per unit:</span>
          <input type="text" onChange={(e) => setPricePerUnit(e.target.value)} value={pricePerUnit} style={{padding: '3px'}}/>
        </p>

        <p>
          <span style={{ marginRight: '10px' }}>Quantity:</span>
          <input type="text" onChange={(e) => setQuantity(e.target.value)} value={quantity} style={{padding: '3px'}}/>
        </p>

        <button 
        style={{padding: '3px'}}
        onClick={() => {

          const itemToAdd = {
            itemName,
            pricePerUnit: pricePerUnit, //change to number on submit
            quantity: quantity, //change to number on submit
          }

          const newItems = allItems.slice()
          newItems.push(itemToAdd)
          setAllItems(newItems) // updating this value in state will call calculateTotal bc of useEffect

          // save to db - only change items, rest should remain the same
          // updateFirestoreData(newItems, savedDiscountPercentage, savedTaxPercentage);

          setItemName('')
          setPricePerUnit('')
          setQuantity('')
        }}>
          Add
      </button>
      </div>

      <div style={{ marginLeft: '30px', marginTop: '50px' }}>
        <div style={{display: 'flex', alignItems:'center'}}>
          <h2>Price Checkout Calculator</h2>
          <img src="calc.png" style={{width: '20px', height: '20px', marginLeft: '10px'}}></img>
        </div>
        
        <div>
          <p>
            <span style={{ marginRight: '10px' }}>Tax percentage (on subtotal):</span>
            <input type="text" onChange={(e) => setNewTaxPercentage(e.target.value)} value={newTaxPercentage} style={{ width: '70px', padding:'3px' }}/>

            <button style={{ marginLeft: '10px', padding: '3px' }}
              onClick={() => {
                setSavedTaxPercentage(newTaxPercentage) // updating this value in state will call calculateTotal bc of useEffect
                // save to db - only change tax, rest should remain the same
                // updateFirestoreData(allItems, savedDiscountPercentage, newTaxPercentage);
                // reset input value
                setNewTaxPercentage('')
              }}>
              Apply
      </button>
          </p>

          <p>
            <span style={{ marginRight: '10px' }}>Discount percentage (on subtotal):</span>
            <input type="text" onChange={(e) => setNewDiscountPercentage(e.target.value)} value={newDiscountPercentage} style={{ width: '70px', padding: '3px'}}/>

            <button style={{ marginLeft: '10px', padding: '3px'}}
              onClick={() => {
                setSavedDiscountPercentage(newDiscountPercentage)// updating this value in state will call calculateTotal bc of useEffect 
                // save to db - only change discount, rest should remain the same
                // updateFirestoreData(allItems, newDiscountPercentage, savedTaxPercentage);
                // reset input value 
                setNewDiscountPercentage('')
              }}>
              Apply
            </button>
          </p>
        </div>

        <div>
          <hr style={{marginRight: '550px'}} />

          <table style={{ width: '50%' }}>
            <tbody>
              <tr>
                <th style={{ textAlign: 'left' }}>Item Name</th>
                <th style={{ textAlign: 'left' }}>Price Per Unit</th>
                <th style={{ textAlign: 'left' }}>Quantity</th>
                <th style={{ textAlign: 'left' }}>Subtotal</th>
              </tr>

              {allItems.map((item, i) => {

                let itemTotal
                if (isNaN(item.pricePerUnit) || isNaN(item.quantity)) {
                  itemTotal = 0
                }
                else {
                  itemTotal = item.pricePerUnit * item.quantity
                }

                return (
                  <tr style={{ height: '50px' }} key={i}>
                    <td>{item.itemName}</td>
                    <td>{item.pricePerUnit}</td>
                    <td>{item.quantity}</td>
                    <td>{itemTotal}</td>
                    <td>
                      <button
                        style={{padding: '3px'}}
                        onClick={() => {
                        const itemToRemove = JSON.parse(JSON.stringify(item)) // deep copy 
                        const newItems = allItems.filter((currentItem) => {
                          // if all values are the same - don't want this item
                          // this would delete all items with all similar values
                          // ideally would use id's but using this check for simplification
                          if (currentItem.itemName === itemToRemove.itemName
                            && currentItem.quantity === itemToRemove.quantity
                            && currentItem.pricePerUnit === itemToRemove.pricePerUnit) {
                            return false
                          }
                          return true
                        })
                        setAllItems(newItems) // updating this value in state will call calculateTotal bc of useEffect
                        // save to db - only change items, rest should remain the same
                        // updateFirestoreData(newItems, savedDiscountPercentage, savedTaxPercentage);
                      }}>
                        Remove
                    </button>
                    </td>
                  </tr>
                )
              })}

            </tbody>
          </table>
        </div>


        <div>
        <hr style={{marginRight: '550px'}} />
          <p>
            <span>Subtotal: </span> <span>{subtotal}</span>
          </p>

          <p>
            <span>Currently applied tax percentage: </span> <span>{savedTaxPercentage}</span>
          </p>

          <p>
            <span>Currently applied discount percentage: </span> <span>{savedDiscountPercentage}</span>
          </p>

          <p style={{ fontWeight: 'bold' }}>
            <span>Total: </span> <span>{total}</span>
          </p>
          <button
            style={{padding: '3px'}}
            onClick={() => {
              const newDiscountPercentage = 0;
              const newTaxPercentage = 0;
              const newAllItems = [];

              setSavedTaxPercentage(newTaxPercentage);
              setSavedDiscountPercentage(newDiscountPercentage);
              setAllItems(newAllItems);

              // updateFirestoreData(newAllItems, newDiscountPercentage, newTaxPercentage);
              
            }}>
            Reset All Data
      </button>
        </div>
      </div>
    </>
  );


}
export default App;