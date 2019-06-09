package ru.holuhoev.bet;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.HashMap;

@Controller
public class BetEventController {

    public HashMap<String, BetEvent> bet360Events = new HashMap<>();
    public HashMap<String, BetEvent> otherEvents  = new HashMap<>();


    @MessageMapping("/all")
    @SendTo("/topic/all")
    public ResponseEntity events(BetEvent event) {

        // TODO: вычислить уникальное имя события
        if (event.getBrand().equals("bet360")) {
            bet360Events.put(event.toKey(), event);
        } else {
            otherEvents.put(event.toKey(), event);
        }

        // TODO: Отправить калькулированное значение в /bets
        return ResponseEntity.ok(event);
    }
}
