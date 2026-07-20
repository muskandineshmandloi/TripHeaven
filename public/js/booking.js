const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");
const rooms = document.getElementById("rooms");

const nightsSpan = document.getElementById("totalNights");
const roomsSpan = document.getElementById("totalRooms");
const totalSpan = document.getElementById("estimatedTotal");

function calculateBooking() {

    if (!checkIn.value || !checkOut.value) return;

    const start = new Date(checkIn.value);
    const end = new Date(checkOut.value);

    const oneDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil((end - start) / oneDay);

    if (nights <= 0) {
        nightsSpan.textContent = 0;
        totalSpan.textContent = 0;
        return;
    }

    const roomCount = Number(rooms.value);

    roomsSpan.textContent = roomCount;
    nightsSpan.textContent = nights;

    const total = listingPrice * nights * roomCount;

    totalSpan.textContent = total.toLocaleString("en-IN");
}

checkIn.addEventListener("change", calculateBooking);
checkOut.addEventListener("change", calculateBooking);
rooms.addEventListener("input", calculateBooking);