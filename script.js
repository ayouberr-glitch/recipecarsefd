document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('recipeForm');
    const addIngredientBtn = document.getElementById('addIngredient');
    const addInstructionBtn = document.getElementById('addInstruction');
    const ingredientsList = document.getElementById('ingredientsList');
    const instructionsList = document.getElementById('instructionsList');
    const recipeCard = document.getElementById('recipeCard');

    function createIngredientInput() {
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
        return div;
    }

    function createInstructionInput() {
        const div = document.createElement('div');
        div.className = 'instruction-input';
        div.innerHTML = `
            <textarea required placeholder="Enter instruction step"></textarea>
            <button type="button" class="remove-instruction">×</button>
        `;
        return div;
    }

    // Add ingredient
    addIngredientBtn.addEventListener('click', () => {
        ingredientsList.appendChild(createIngredientInput());
    });

    // Add instruction
    addInstructionBtn.addEventListener('click', () => {
        instructionsList.appendChild(createInstructionInput());
    });

    // Add bulk ingredients
    document.getElementById('addBulkIngredients').addEventListener('click', function() {
        const bulkText = document.getElementById('bulkIngredients').value;
        const lines = bulkText.split('\n').filter(line => line.trim());
        
        lines.forEach(line => {
            const match = line.match(/^([\d./]+)\s*(\w+)\s+(.+)$/);
            if (match) {
                const [_, quantity, unit, ingredient] = match;
                const div = document.createElement('div');
                div.className = 'ingredient-input';
                div.innerHTML = `
                    <input type="number" step="0.25" value="${quantity}" required>
                    <select class="unit-select" required>
                        <option value="${unit}">${unit}</option>
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
                    <input type="text" value="${ingredient}" required>
                    <button type="button" class="remove-ingredient">×</button>
                `;
                ingredientsList.appendChild(div);
            }
        });
        document.getElementById('bulkIngredients').value = '';
    });

    // Add bulk instructions
    document.getElementById('addBulkInstructions').addEventListener('click', function() {
        const bulkText = document.getElementById('bulkInstructions').value;
        const lines = bulkText.split('\n').filter(line => line.trim());
        
        lines.forEach(instruction => {
            const div = document.createElement('div');
            div.className = 'instruction-input';
            div.innerHTML = `
                <textarea required>${instruction}</textarea>
                <button type="button" class="remove-instruction">×</button>
            `;
            instructionsList.appendChild(div);
        });
        document.getElementById('bulkInstructions').value = '';
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

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gather ingredients
        const ingredients = Array.from(ingredientsList.children).map(ing => {
            const [quantity, unit, ingredient] = ing.querySelectorAll('input, select');
            return {
                quantity: quantity.value,
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
                            <span>•</span>
                            <span><i class="fas fa-clock"></i> ${document.getElementById('prepTime').value + parseInt(document.getElementById('cookTime').value)} min</span>
                        </div>
                    </div>
                </div>

                <div class="recipe-content">
                    <div class="recipe-stats">
                        <div class="stat">
                            <i class="fas fa-clock"></i>
                            <div class="stat-value">${document.getElementById('prepTime').value} min</div>
                            <div class="stat-label">Prep Time</div>
                        </div>
                        <div class="stat">
                            <i class="fas fa-fire"></i>
                            <div class="stat-value">${document.getElementById('cookTime').value} min</div>
                            <div class="stat-label">Cook Time</div>
                        </div>
                        <div class="stat">
                            <i class="fas fa-users"></i>
                            <div class="stat-value">
                                <input type="number" id="servings" value="1" min="1">
                            </div>
                            <div class="stat-label">Servings</div>
                        </div>
                    </div>

                    <h2 class="section-title"><i class="fas fa-list"></i> Ingredients</h2>
                    <div class="ingredients-list">
                        ${ingredients.map(ing => `
                            <div class="ingredient-item" data-quantity="${ing.quantity}">
                                <span class="quantity">${ing.quantity}</span> ${ing.unit} ${ing.ingredient}
                            </div>
                        `).join('')}
                    </div>

                    <h2 class="section-title"><i class="fas fa-tasks"></i> Instructions</h2>
                    <div class="instructions-list">
                        ${instructions.map(inst => `
                            <div class="instruction-item">${inst}</div>
                        `).join('')}
                    </div>

                    <div class="nutrition">
                        <h2 class="section-title"><i class="fas fa-chart-pie"></i> Nutrition Information</h2>
                        <div class="nutrition-grid">
                            <div class="nutrition-item">
                                <i class="fas fa-fire-alt"></i>
                                <div class="nutrition-value" id="calories">${document.getElementById('calories').value}</div>
                                <div class="nutrition-label">Calories</div>
                            </div>
                            <div class="nutrition-item">
                                <i class="fas fa-dumbbell"></i>
                                <div class="nutrition-value" id="protein">${document.getElementById('protein').value}</div>
                                <div class="nutrition-label">Protein (g)</div>
                            </div>
                            <div class="nutrition-item">
                                <i class="fas fa-seedling"></i>
                                <div class="nutrition-value" id="fiber">${document.getElementById('fiber').value}</div>
                                <div class="nutrition-label">Fiber (g)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        recipeCard.innerHTML = html;

        // Initialize servings calculator
        const servingsInput = recipeCard.querySelector('#servings');
        if (servingsInput) {
            servingsInput.addEventListener('input', function() {
                const servings = parseFloat(this.value) || 1;
                const ingredients = recipeCard.querySelectorAll('.ingredient-item');
                
                ingredients.forEach(ingredient => {
                    const baseQuantity = parseFloat(ingredient.getAttribute('data-quantity'));
                    const newQuantity = (baseQuantity * servings).toFixed(2);
                    const quantitySpan = ingredient.querySelector('.quantity');
                    if (quantitySpan) {
                        quantitySpan.textContent = newQuantity % 1 === 0 ? Math.round(newQuantity) : newQuantity;
                    }
                });

                const calories = document.getElementById('calories').value;
                const protein = document.getElementById('protein').value;
                const fiber = document.getElementById('fiber').value;

                recipeCard.querySelector('#calories').textContent = Math.round(calories * servings);
                recipeCard.querySelector('#protein').textContent = Math.round(protein * servings);
                recipeCard.querySelector('#fiber').textContent = Math.round(fiber * servings);
            });
        }
    });

    // Copy HTML button
    document.getElementById('copyHtml').addEventListener('click', function() {
        const recipeCard = document.getElementById('recipeCard');
        const htmlContent = recipeCard.innerHTML;
        
        navigator.clipboard.writeText(htmlContent).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    });

    // Add initial ingredient and instruction fields
    addIngredientBtn.click();
    addInstructionBtn.click();
});