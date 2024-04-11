# Concepts for the game

Progress month:

1. Clear message box
2. Progress any active constructions and update value accordingly
3. Apply bonuses from the capital based on the capital's level
4. Updates the current building cost for any upgradeable building
5. Calculate available space for pops
6. Generate and display events

7. Calculate resource gain / spend:
    a. Increase month
    b. Calculate gold gains / losses
    c. Calculate pop gains / losses (except from events)
    d. Calculate food gains / losses
    e. Calculate other resource gains (wood, stone, metals, runes....)

8. Print resource gain / loss messages
9. Check if pop is at or above max space. If the same, triggers the appropriate alert
10. Check if food status. If the food is low and consumption is equal or higher than production, trigger appropriate alert
11. If there are units in queue, recruit them
12. Calculate happines based on various conditions (taxes, alerts, etc.). If happiness is at 0, triggers 'Riot' event.
13. Calculate total might 
14. Displays all active alerts
15. Re-generate DOM with the updated values
