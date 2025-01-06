document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recipeForm');
    const addIngredientBtn = document.getElementById('addIngredient');
    const addInstructionBtn = document.getElementById('addInstruction');
    const ingredientsList = document.getElementById('ingredientsList');
    const instructionsList = document.getElementById('instructionsList');
    const copyHtmlBtn = document.getElementById('copyHtml');

    function formatTime(minutes) {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours} hr${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min` : ''}`;
        }
        return `${minutes} min`;
    }

    // Add ingredient field
    addIngredientBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'ingredient-input';
        div.innerHTML = `
            <input type="number" step="0.25" placeholder="Quantity" required>
            <select class="unit-select" required>
                <option value="cup">cup</option>
                <option value="tablespoon">tablespoon</option>
                <option value="teaspoon">teaspoon</option>
                <option value="ounce">ounce</option>
                <option value="pound">pound</option>
                <option value="gram">gram</option>
                <option value="ml">ml</option>
                <option value="piece">piece</option>
                <option value="slice">slice</option>
                <option value="to taste">to taste</option>
            </select>
            <input type="text" placeholder="Ingredient" required>
            <button type="button" class="remove-ingredient">×</button>
        `;
        ingredientsList.appendChild(div);
    });

    // Add instruction field
    addInstructionBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'instruction-input';
        div.innerHTML = `
            <textarea required></textarea>
            <button type="button" class="remove-instruction">×</button>
        `;
        instructionsList.appendChild(div);
    });

    // Remove ingredient/instruction
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-ingredient')) {
            e.target.parentElement.remove();
        }
        if (e.target.classList.contains('remove-instruction')) {
            e.target.parentElement.remove();
        }
    });

    function generateRecipeCard(servings = 1) {
        // Gather ingredients
        const ingredients = Array.from(ingredientsList.children).map(ing => {
            const [quantity, unit, ingredient] = ing.querySelectorAll('input, select');
            return {
                quantity: parseFloat(quantity.value) * servings,
                unit: unit.value,
                ingredient: ingredient.value
            };
        });

        // Gather instructions
        const instructions = Array.from(instructionsList.children).map(inst => 
            inst.querySelector('textarea').value
        );

        const html = `
            <div class="recipe-card">
                <div class="recipe-header">
                    <img class="recipe-image" src="${document.getElementById('recipeImage').value}" alt="${document.getElementById('recipeTitle').value}">
                    <div class="recipe-overlay">
                        <h1 class="recipe-title">${document.getElementById('recipeTitle').value}</h1>
                        <div class="recipe-meta">
                            <span><i class="fas fa-utensils"></i> ${document.getElementById('category').value}</span>
                        </div>
                    </div>
                </div>

                <div class="recipe-content">
                    <div class="recipe-stats">
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            <div class="stat-value">${formatTime(document.getElementById('prepTime').value)}</div>
                            <div class="stat-label">Prep Time</div>
                        </div>
                        <div class="stat">
                            <i class="fas fa-fire"></i>
                            <div class="stat-value">${formatTime(document.getElementById('cookTime').value)}</div>
                            <div class="stat-label">Cook Time</div>
                        </div>
                        <div class="stat">
                            <i class="fas fa-users"></i>
                            <div class="stat-value">
                                <input type="number" id="servings" value="${servings}" min="1">
                            </div>
                            <div class="stat-label">Servings</div>
                        </div>
                    </div>

                    <h2 class="section-title"><i class="fas fa-list"></i> Ingredients</h2>
                    <div class="ingredients-list">
                        ${ingredients.map(ing => `
                            <div class="ingredient-item" data-base-quantity="${ing.quantity/servings}">
                                ${ing.quantity} ${ing.unit} ${ing.ingredient}
                            </div>
                        `).join('')}
                    </div>

                    <h2 class="section-title"><i class="fas fa-tasks"></i> Instructions</h2>
                    <div class="instructions-list">
                        ${instructions.map(inst => `
                            <div class="instruction-item">
                                ${inst}
                            </div>
                        `).join('')}
                    </div>

                    <div class="nutrition">
                        <h2 class="section-title"><i class="fas fa-chart-pie"></i> Nutrition Information</h2>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <i class="fas fa-fire-alt"></i>
                                <div class="nutrition-value">${document.getElementById('calories').value * servings}</div>
                                <div class="nutrition-label">Calories</div>
                            </div>
                            <div class="nutrition-item">
                                <i class="fas fa-dumbbell"></i>
                                <div class="nutrition-value">${document.getElementById('protein').value * servings}</div>
                                <div class="nutrition-label">Protein (g)</div>
                            </div>
                            <div class="nutrition-item">
                                <i class="fas fa-seedling"></i>
                                <div class="nutrition-value">${document.getElementById('fiber').value * servings}</div>
                                <div class="nutrition-label">Fiber (g)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const recipeCard = document.getElementById('recipeCard');
        recipeCard.innerHTML = generateRecipeCard(1);
        copyHtmlBtn.style.display = 'block';

        // Add servings input listener
        const servingsInput = recipeCard.querySelector('#servings');
        servingsInput.addEventListener('input', function() {
            const servings = parseFloat(this.value) || 1;
            recipeCard.innerHTML = generateRecipeCard(servings);
            
            // Reattach the event listener to the new servings input
            const newServingsInput = recipeCard.querySelector('#servings');
            newServingsInput.addEventListener('input', arguments.callee);
        });
    });

    // Copy HTML button
    copyHtmlBtn.addEventListener('click', () => {
        const recipeCard = document.getElementById('recipeCard');
        const htmlContent = recipeCard.innerHTML;
        navigator.clipboard.writeText(htmlContent).then(() => {
            alert('HTML copied to clipboard!');
        });
    });
});