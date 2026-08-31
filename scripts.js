// =============================================
// Global Variables
// =============================================

let allPublications = [];
let showingSelected = true;


// =============================================
// Initialize Page
// =============================================

document.addEventListener("DOMContentLoaded", function () {

    loadPublications();

    const sections = document.querySelectorAll("section");

    sections.forEach((section, index) => {

        section.style.animationDelay =
            `${index * 0.1}s`;

    });


    const toggleButton =
        document.getElementById("toggle-publications");

    if (toggleButton) {

        toggleButton.addEventListener(
            "click",
            togglePublications
        );

    }

});


// =============================================
// Load Publications
// =============================================

function loadPublications() {

    fetch("publications.json")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    `Unable to load publications.json: ${response.status}`
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Publications loaded successfully:",
                data
            );

            allPublications =
                data.publications || [];

            renderPublications(true);

        })

        .catch(error => {

            console.error(
                "Error loading publications:",
                error
            );

            displayFallbackPublications();

        });

}


// =============================================
// Fallback
// =============================================

function displayFallbackPublications() {

    const container =
        document.getElementById(
            "publications-container"
        );

    if (container) {

        container.innerHTML = `
            <p class="publication-error">
                Unable to load publications.
                Please make sure
                <strong>publications.json</strong>
                is in the same folder as index.html.
            </p>
        `;

    }

}


// =============================================
// Toggle Publications
// =============================================

function togglePublications() {

    showingSelected =
        !showingSelected;

    renderPublications(
        showingSelected
    );


    const toggleButton =
        document.getElementById(
            "toggle-publications"
        );


    const toggleHeader =
        document.getElementById(
            "toggle-header"
        );


    if (toggleButton) {

        toggleButton.textContent =
            showingSelected
                ? "Show All"
                : "Show Selected";

    }


    if (toggleHeader) {

        toggleHeader.textContent =
            showingSelected
                ? "Selected Publications"
                : "All Publications";

    }

}


// =============================================
// Render Publications
// =============================================

function renderPublications(selectedOnly) {

    const container =
        document.getElementById(
            "publications-container"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const publicationsToShow =
        selectedOnly

            ? allPublications.filter(
                publication =>
                    publication.selected === 1
            )

            : allPublications;


    if (
        publicationsToShow.length === 0
    ) {

        container.innerHTML =
            "<p>No publications available.</p>";

        return;
    }


    publicationsToShow.forEach(
        publication => {

            const element =
                createPublicationElement(
                    publication
                );

            container.appendChild(
                element
            );

        }
    );

}


// =============================================
// Create Publication
// =============================================

function createPublicationElement(
    publication
) {

    const pubItem =
        document.createElement("div");

    pubItem.className =
        "publication-item";


    // -----------------------------------------
    // Thumbnail
    // -----------------------------------------

    const thumbnail =
        document.createElement("div");

    thumbnail.className =
        "pub-thumbnail";


    thumbnail.onclick = function () {

        openModal(
            publication.thumbnail
        );

    };


    const thumbnailImg =
        document.createElement("img");

    thumbnailImg.src =
        publication.thumbnail;

    thumbnailImg.alt =
        `${publication.title} thumbnail`;


    thumbnailImg.onerror =
        function () {

            thumbnail.style.display =
                "none";

        };


    thumbnail.appendChild(
        thumbnailImg
    );


    // -----------------------------------------
    // Content
    // -----------------------------------------

    const content =
        document.createElement("div");

    content.className =
        "pub-content";


    // -----------------------------------------
    // Title
    // -----------------------------------------

    const title =
        document.createElement("div");

    title.className =
        "pub-title";

    title.textContent =
        publication.title;


    content.appendChild(
        title
    );


    // -----------------------------------------
    // Authors
    // -----------------------------------------

    const authors =
        document.createElement("div");

    authors.className =
        "pub-authors";


    let authorsHTML = "";


    publication.authors.forEach(
        (author, index) => {


            if (
                author
                    .toLowerCase()
                    .includes("jannat sultana")
            ) {

                authorsHTML +=
                    `<span class="highlight-name">
                        ${author}
                    </span>`;

            } else {

                authorsHTML +=
                    author;

            }


            if (
                index <
                publication.authors.length - 1
            ) {

                authorsHTML += ", ";

            }

        }
    );


    authors.innerHTML =
        authorsHTML;


    content.appendChild(
        authors
    );


    // -----------------------------------------
    // Venue
    // -----------------------------------------

    const venueContainer =
        document.createElement("div");

    venueContainer.className =
        "pub-venue-container";


    const venue =
        document.createElement("div");

    venue.className =
        "pub-venue";

    venue.textContent =
        publication.venue;


    venueContainer.appendChild(
        venue
    );


    // -----------------------------------------
    // Award
    // -----------------------------------------

    if (
        publication.award &&
        publication.award.trim() !== ""
    ) {

        const award =
            document.createElement("div");

        award.className =
            "pub-award";

        award.textContent =
            publication.award;


        venueContainer.appendChild(
            award
        );

    }


    content.appendChild(
        venueContainer
    );


    // -----------------------------------------
    // Links
    // -----------------------------------------

    if (publication.links) {

        const links =
            document.createElement("div");

        links.className =
            "pub-links";


        if (
            publication.links.pdf
        ) {

            const paperLink =
                document.createElement("a");

            paperLink.href =
                publication.links.pdf;

            paperLink.textContent =
                "[Paper]";

            paperLink.target =
                "_blank";

            paperLink.rel =
                "noopener noreferrer";


            links.appendChild(
                paperLink
            );

        }


        if (
            publication.links.code
        ) {

            const codeLink =
                document.createElement("a");

            codeLink.href =
                publication.links.code;

            codeLink.textContent =
                "[Code]";

            codeLink.target =
                "_blank";

            codeLink.rel =
                "noopener noreferrer";


            links.appendChild(
                codeLink
            );

        }


        if (
            publication.links.project
        ) {

            const projectLink =
                document.createElement("a");

            projectLink.href =
                publication.links.project;

            projectLink.textContent =
                "[Demo]";

            projectLink.target =
                "_blank";

            projectLink.rel =
                "noopener noreferrer";


            links.appendChild(
                projectLink
            );

        }


        content.appendChild(
            links
        );

    }


    // -----------------------------------------
    // Assemble
    // -----------------------------------------

    pubItem.appendChild(
        thumbnail
    );

    pubItem.appendChild(
        content
    );


    return pubItem;

}


// =============================================
// Image Modal
// =============================================

function openModal(imageSrc) {

    const modal =
        document.getElementById(
            "imageModal"
        );


    const modalImg =
        document.getElementById(
            "modalImage"
        );


    if (
        !modal ||
        !modalImg
    ) {

        return;

    }


    modal.style.display =
        "block";


    setTimeout(() => {

        modal.classList.add(
            "show"
        );

    }, 10);


    modalImg.src =
        imageSrc;

}


// =============================================
// Close Modal
// =============================================

function closeModal() {

    const modal =
        document.getElementById(
            "imageModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    setTimeout(() => {

        modal.style.display =
            "none";

    }, 300);

}


// =============================================
// Close Modal on Background Click
// =============================================

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "imageModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeModal();

        }

    }
);


// =============================================
// Close Modal with ESC
// =============================================

window.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);
```
