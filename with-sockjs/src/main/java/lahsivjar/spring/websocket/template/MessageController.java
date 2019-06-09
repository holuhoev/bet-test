package lahsivjar.spring.websocket.template;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {

    @MessageMapping("/all")
    @SendTo("/topic/all")
    public String post(@Payload String message) {
        return message;
    }
}
