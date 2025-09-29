class CalorieTracker {
    constructor() {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._displayTotalCalories();
        this._displayCaloriesLimit();
        this._displayCaloriesBurned();
        this._displayCaloriesIntake();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        document.getElementById('limit').value = this._calorieLimit;
    }

    // Public methods
    addMeal(meal) {
        this._meals.push(meal);
        this._displayMeal(meal);
        this._totalCalories += meal.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._updateUI();
    }

    removeMeal(mealId) {
        let deletedMeal;
        for (let meal of this._meals) {
            if (meal.id === mealId) {
                deletedMeal = meal;
            }
        }

        this._meals = this._meals.filter(meal => meal.id !== mealId);
        this._totalCalories -= deletedMeal.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.removeMeal(mealId);
        this._updateUI();
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._displayWorkout(workout);
        this._totalCalories -= workout.calories;
        -0;
        Storage.setTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._updateUI();
    }

    removeWorkout(workoutId) {
        let deletedWorkout;
        for (let workout of this._workouts) {
            if (workout.id === workoutId) {
                deletedWorkout = workout;
            }
        }

        this._workouts = this._workouts.filter(
            workout => workout.id !== workoutId
        );
        this._totalCalories += deletedWorkout.calories;
        Storage.setTotalCalories(this._totalCalories);
        Storage.removeWorkout(workoutId);
        this._updateUI();
    }

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        Storage.clear();
        this._updateUI();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;
        Storage.setCalorielimit(calorieLimit);
        this._displayCaloriesLimit();
        this._updateUI();
    }

    loadItems() {
        this._meals.forEach(meal => this._displayMeal(meal));
        this._workouts.forEach(workout => this._displayWorkout(workout));
    }

    // Private Methods
    _displayTotalCalories() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
        if (this._totalCalories < 0) {
            totalCaloriesEl.parentElement.parentElement.classList.remove(
                'bg-primary'
            );
            totalCaloriesEl.parentElement.parentElement.classList.add(
                'bg-danger'
            );
        } else if (
            totalCaloriesEl.parentElement.parentElement.classList.contains(
                'bg-danger'
            )
        ) {
            totalCaloriesEl.parentElement.parentElement.classList.remove(
                'bg-danger'
            );
            totalCaloriesEl.parentElement.parentElement.classList.add(
                'bg-primary'
            );
        }
    }

    _displayCaloriesLimit() {
        const caloriesLimitEl = document.getElementById('calories-limit');
        caloriesLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesIntake() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');

        const intake = this._meals.reduce(
            (total, meal) => total + meal.calories,
            0
        );

        caloriesConsumedEl.innerHTML = intake;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');

        const burned = this._workouts.reduce(
            (total, workout) => total + workout.calories,
            0
        );

        caloriesBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl =
            document.getElementById('calories-remaining');

        const remaining = this._calorieLimit - this._totalCalories;

        caloriesRemainingEl.innerHTML = remaining;

        if (remaining <= 0) {
            caloriesRemainingEl.parentElement.parentElement.classList.remove(
                'bg-light'
            );
            caloriesRemainingEl.parentElement.parentElement.classList.add(
                'bg-danger'
            );
        } else {
            caloriesRemainingEl.parentElement.parentElement.classList.remove(
                'bg-danger'
            );
            caloriesRemainingEl.parentElement.parentElement.classList.add(
                'bg-light'
            );
        }
    }

    _displayCaloriesProgress() {
        const progressEl = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage, 100);

        if (this._totalCalories >= 0) {
            progressEl.style.width = `${width}%`;
        } else {
            progressEl.style.width = `${width * -1}%`;
        }

        if (
            +document.getElementById('calories-remaining').innerHTML <= 0 ||
            this._totalCalories < 0
        ) {
            progressEl.classList.add('bg-danger');
        } else if (progressEl.classList.contains('bg-danger')) {
            progressEl.classList.remove('bg-danger');
        }
    }

    _displayMeal(meal) {
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card', 'my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${meal.name}</h4>
                <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
                    ${meal.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        `;
        mealsEl.appendChild(mealEl);
    }

    _displayWorkout(workout) {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
        <div class="card-body">
            <div class="d-flex align-items-center justify-content-between">
                <h4 class="mx-1">${workout.name}</h4>
                <div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">
                    ${workout.calories}
                </div>
                <button class="delete btn btn-danger btn-sm mx-2">
                <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        </div>
        `;
        workoutsEl.appendChild(workoutEl);
    }

    _updateUI() {
        this._displayTotalCalories();
        this._displayCaloriesIntake();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Storage {
    static getCalorieLimit(defaultLimit = 2000) {
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    static setCalorielimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories(defaultCalories = 0) {
        let totalCalories;
        if (localStorage.getItem('totalCalories') === null) {
            totalCalories = defaultCalories;
        } else {
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories;
    }

    static setTotalCalories(calories) {
        localStorage.setItem('totalCalories', calories);
    }

    static getMeals() {
        let meals;
        if (localStorage.getItem('meals') === null) {
            meals = [];
        } else {
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    static saveMeal(meal) {
        const meals = this.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeMeal(mealId) {
        const meals = this.getMeals();
        const updatedMeals = meals.filter(meal => meal.id !== mealId);
        sessionStorage.removeItem('meals');
        localStorage.setItem('meals', JSON.stringify(updatedMeals));
    }

    static getWorkouts() {
        let workouts;
        if (localStorage.getItem('workouts') === null) {
            workouts = [];
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static saveWorkout(workout) {
        const workouts = this.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeWorkout(workoutId) {
        const workouts = this.getWorkouts();
        const updatedWorkouts = workouts.filter(
            workout => workout.id !== workoutId
        );
        sessionStorage.removeItem(workouts);
        localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    }

    static clear() {
        const calorieLimit = localStorage.getItem('calorieLimit');
        localStorage.clear(); // It clears all items
        localStorage.setItem('calorieLimit', calorieLimit);
    }
}

class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._eventHandlers();
        this._tracker.loadItems();
    }

    _eventHandlers() {
        document
            .getElementById('meal-form')
            .addEventListener('submit', this._newItem.bind(this, 'meal'));

        document
            .getElementById('workout-form')
            .addEventListener('submit', this._newItem.bind(this, 'workout'));

        document
            .getElementById('meal-items')
            .addEventListener('click', this._removeItem.bind(this, 'meal'));

        document
            .getElementById('workout-items')
            .addEventListener('click', this._removeItem.bind(this, 'workout'));

        document
            .getElementById('filter-meals')
            .addEventListener('input', this._filterItems.bind(this, 'meal'));

        document
            .getElementById('filter-workouts')
            .addEventListener('input', this._filterItems.bind(this, 'workout'));

        document
            .getElementById('reset')
            .addEventListener('click', this._reset.bind(this));

        document
            .getElementById('limit-form')
            .addEventListener('submit', this._setLimit.bind(this));
    }

    _newItem(type, e) {
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        // Validating Inputs
        if (name.value === '' || calories.value === '') {
            alert('Please fill in the form');
            return;
        }

        if (type === 'meal') {
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        } else {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }

        name.value = '';
        calories.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollpase = new bootstrap.Collapse(collapseItem, {
            toggle: true,
        });
    }

    _removeItem(type, e) {
        if (
            e.target.classList.contains('delete') ||
            e.target.classList.contains('fa-xmark')
        ) {
            if (confirm('Are You Sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');

                type === 'meal'
                    ? this._tracker.removeMeal(id)
                    : this._tracker.removeWorkout(id);

                e.target.closest('.card').remove();
            }
        }
    }

    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();

        document.querySelectorAll(`#${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;

            if (name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    _reset() {
        this._tracker.reset();
        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';
    }

    _setLimit(e) {
        e.preventDefault();

        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('Please set a limit');
            return;
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App();
