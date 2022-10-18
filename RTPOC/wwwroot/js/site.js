
let connection = new signalR.HubConnectionBuilder()
    .withUrl('/positionhub')
    .build();

const mainDiv = document.getElementById("mainDiv");

dragElement(mainDiv);

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    document.getElementById("cursor").onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;

        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        let topPosition = elmnt.offsetTop - pos2;
        let leftPosition = elmnt.offsetLeft - pos1;

        elmnt.style.top = topPosition + "px";
        elmnt.style.left = leftPosition + "px";

        //send messages to other browsers // Clients.Others.SendAsync in hub
        connection
            .invoke("SendPosition", leftPosition, topPosition)
            .catch((err) => {
                    return console.log(err.toString());
                }
            );
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;

    }
}

connection.on("ReceivePosition", (left, top) => {
    document.getElementById(mainDiv.id).style.top = top + 'px';
    document.getElementById(mainDiv.id).style.left = left + 'px';
});

connection.start().then(() => {
    console.log("connected");
})